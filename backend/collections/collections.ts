import { db } from '../db'
import {
    AppResponse,
    DeleteScopeBreakdown,
    handleDBError,
} from '../error-system'

export const createCollection = async (data: {
    user_id: number
    name: string
    category_id: number
    series: string
    procurement_date: string
}) => {
    try {
        const result = await db.runAsync(
            `INSERT INTO collections
            (user_id, name, category_id, series, procurement_date)
            VALUES (?, ?, ?, ?, ?)`,
            [
                data.user_id,
                data.name,
                data.category_id,
                data.series,
                data.procurement_date,
            ]
        )

        const insertedId = result.lastInsertRowId

        const insertedItem = await db.getFirstAsync(
            `SELECT * FROM collections WHERE id = ?`,
            [insertedId]
        )

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

        return {
            success: true,
            message: 'Collection updated',
        }
    } catch (err) {
        return handleDBError(err, 'Update collection')
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
    userId: number
): Promise<AppResponse<any[]>> => {
    try {
        if (userId == null || Number.isNaN(Number(userId))) {
            return {
                success: false,
                message: 'User is required',
            }
        }

        const rows = await db.getAllAsync(
            `SELECT * FROM collections WHERE user_id = ? ORDER BY id DESC`,
            [userId]
        )

        return {
            success: true,
            message: 'Collections loaded',
            data: rows as any[],
        }
    } catch (err) {
        return handleDBError(err, 'Load collections')
    }
}
