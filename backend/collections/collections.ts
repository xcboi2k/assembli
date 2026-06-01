import { db } from '../db'
import {
    AppResponse,
    DeleteScopeBreakdown,
    handleDBError,
} from '../error-system'
import { createHistory } from './session-histories'

export const createCollection = async (data: {
    user_id: number
    name: string
    category_id: number
    series: string
    procurement_date: string
}) => {
    try {
        const createdAt = new Date().toISOString()

        const result = await db.runAsync(
            `INSERT INTO collections
            (user_id, name, category_id, series, procurement_date, created_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                data.user_id,
                data.name,
                data.category_id,
                data.series,
                data.procurement_date,
                createdAt,
            ]
        )

        const insertedId = result.lastInsertRowId

        const insertedItem = await db.getFirstAsync(
            `SELECT * FROM collections WHERE id = ?`,
            [insertedId]
        )

        await createHistory({
            user_id: data.user_id,
            collection_id: insertedId,
            action: 'create',
            details: `Created collection "${data.name}"`,
        })

        return {
            success: true,
            message: 'Collection created',
            data: insertedItem,
        }
    } catch (error) {
        console.log(error)

        return {
            success: false,
            message: 'Failed to create collection',
            collection_id: null,
        }
    }
}

export const updateCollection = async (data: any): Promise<AppResponse> => {
    try {
        if (!data.id) {
            return {
                success: false,
                message: 'Collection id is required',
            }
        }

        if (!data.user_id) {
            return {
                success: false,
                message: 'User is required',
            }
        }

        if (!data.name) {
            return {
                success: false,
                message: 'Collection name is required',
            }
        }

        const result = await db.runAsync(
            `UPDATE collections
             SET name = ?, series = ?, category_id = ?, procurement_date = ?
             WHERE id = ? AND user_id = ?`,
            [
                data.name,
                data.series ?? null,
                data.category_id ?? null,
                data.procurement_date ?? null,
                data.id,
                data.user_id,
            ]
        )

        if (result.changes === 0) {
            return {
                success: false,
                message: 'Collection not found',
            }
        }

        await createHistory({
            user_id: data.user_id,
            collection_id: data.id,
            action: 'content_update',
            details: `Updated collection "${data.name}"`,
        })

        return {
            success: true,
            message: 'Collection updated',
        }
    } catch (err) {
        return handleDBError(err, 'Update collection')
    }
}

export const updateCollectionStatus = async (
    userId: number,
    dataId: number,
    status: string,
    completedAt: string | null = null
): Promise<AppResponse> => {
    try {
        if (!userId) {
            return {
                success: false,
                message: 'User is required',
            }
        }

        if (!dataId) {
            return {
                success: false,
                message: 'Collection item id is required',
            }
        }

        if (!status.trim()) {
            return {
                success: false,
                message: 'Collection item status is required',
            }
        }

        const result = await db.runAsync(
            `UPDATE collections
             SET status = ?,
                 completed_at = ?
             WHERE id = ? AND user_id = ?`,
            [status, completedAt, dataId, userId]
        )

        if (result.changes === 0) {
            return {
                success: false,
                message: 'Task not found',
            }
        }

        await createHistory({
            user_id: userId,
            collection_id: dataId,
            action: 'status_update',
            details: `Updated collection status to "${status}`,
        })

        return {
            success: true,
            message: 'Task status updated',
        }
    } catch (err) {
        return handleDBError(err, 'Update task status')
    }
}

export const deleteCollection = async (
    data: any
): Promise<AppResponse<DeleteScopeBreakdown>> => {
    try {
        if (!data.id) {
            return {
                success: false,
                message: 'Collection id is required',
            }
        }

        if (!data.user_id) {
            return {
                success: false,
                message: 'User is required',
            }
        }

        const coll = await db.getFirstAsync(
            `SELECT id FROM collections WHERE id = ? AND user_id = ?`,
            [data.id, data.user_id]
        )

        if (!coll) {
            return {
                success: false,
                message: 'Collection not found',
            }
        }

        const tasksRow = await db.getFirstAsync<{ n: number }>(
            `SELECT COUNT(*) as n FROM tasks WHERE collection_id = ?`,
            [data.id]
        )
        const taskCount = Number(tasksRow?.n ?? 0)

        const subtasksRow = await db.getFirstAsync<{ n: number }>(
            `SELECT COUNT(*) as n FROM subtasks WHERE task_id IN (SELECT id FROM tasks WHERE collection_id = ?)`,
            [data.id]
        )
        const subtaskCount = Number(subtasksRow?.n ?? 0)

        await db.runAsync(
            `DELETE FROM subtasks WHERE task_id IN (SELECT id FROM tasks WHERE collection_id = ?)`,
            [data.id]
        )

        await db.runAsync(`DELETE FROM tasks WHERE collection_id = ?`, [
            data.id,
        ])

        const result = await db.runAsync(
            `DELETE FROM collections WHERE id = ? AND user_id = ?`,
            [data.id, data.user_id]
        )

        if (result.changes === 0) {
            return {
                success: false,
                message: 'Collection not found',
            }
        }

        await createHistory({
            user_id: data.user_id,
            collection_id: data.id,
            action: 'delete',
            details: `Deleted collection`,
        })

        const breakdown: DeleteScopeBreakdown = {
            removed: {
                collections: 1,
                tasks: taskCount,
                subtasks: subtaskCount,
                categories: 0,
            },
            skipped: {
                categoryCatalogNote:
                    'Shared category catalog rows were not modified. Only this collection and its tasks/subtasks were removed.',
            },
        }

        return {
            success: true,
            message: 'Collection deleted',
            data: breakdown,
        }
    } catch (err) {
        return handleDBError(
            err,
            'Delete collection'
        ) as AppResponse<DeleteScopeBreakdown>
    }
}

export const getCollectionsByUserId = async (
    userId: number,
    options?: {
        search?: string
        category_id?: number
    }
): Promise<AppResponse<any[]>> => {
    try {
        if (userId == null || Number.isNaN(Number(userId))) {
            return {
                success: false,
                message: 'User is required',
            }
        }

        let query = `
            SELECT *
            FROM collections
            WHERE user_id = ?
        `

        const params: any[] = [userId]

        // search by name or series
        if (options?.search?.trim()) {
            query += `
                AND (
                    name LIKE ?
                    OR series LIKE ?
                )
            `

            const searchValue = `%${options.search.trim()}%`

            params.push(searchValue, searchValue)
        }

        // filter by category
        if (options?.category_id) {
            query += `
                AND category_id = ?
            `

            params.push(options.category_id)
        }

        query += ` ORDER BY id DESC`

        const rows = await db.getAllAsync(query, params)

        return {
            success: true,
            message: 'Collections loaded',
            data: rows as any[],
        }
    } catch (err) {
        return handleDBError(err, 'Load collections')
    }
}

export const getCollectionById = async (
    collectionId: number
): Promise<AppResponse<any>> => {
    try {
        if (collectionId == null || Number.isNaN(Number(collectionId))) {
            return {
                success: false,
                message: 'Collection id is required',
            }
        }

        const row = await db.getFirstAsync(
            `SELECT * FROM collections
             WHERE id = ?`,
            [collectionId]
        )

        if (!row) {
            return {
                success: false,
                message: 'Collection not found',
            }
        }

        return {
            success: true,
            message: 'Collection loaded',
            data: row as any,
        }
    } catch (err) {
        return handleDBError(err, 'Load collection')
    }
}
