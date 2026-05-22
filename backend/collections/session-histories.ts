import { db } from '../db'
import { handleDBError } from '../error-system'

export const createHistory = async (data: {
    user_id: number
    collection_id?: number | null
    task_id?: number | null
    subtask_id?: number | null
    category_id?: number | null
    action: string
    details: string
}) => {
    try {
        await db.runAsync(
            `INSERT INTO session_histories (
                user_id,
                collection_id,
                task_id,
                subtask_id,
                category_id,
                action,
                details,
                created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.user_id,
                data.collection_id ?? null,
                data.task_id ?? null,
                data.subtask_id ?? null,
                data.category_id ?? null,
                data.action,
                data.details,
                new Date().toISOString(),
            ]
        )

        return {
            success: true,
        }
    } catch (err) {
        console.log(err)

        return {
            success: false,
        }
    }
}

export const getSessionHistoriesByUserId = async (userId: number) => {
    try {
        const rows = await db.getAllAsync(
            `SELECT *
             FROM session_histories
             WHERE user_id = ?
             ORDER BY created_at DESC`,
            [userId]
        )

        return {
            success: true,
            message: 'Sessions loaded',
            data: rows,
        }
    } catch (err) {
        return handleDBError(err, 'Load sessions')
    }
}

export const getSessionHistoriesByCollectionId = async (
    collectionId: number
) => {
    try {
        const rows = await db.getAllAsync(
            `SELECT *
                 FROM session_histories
                 WHERE collection_id = ?
                 ORDER BY created_at DESC`,
            [collectionId]
        )

        return {
            success: true,
            message: 'Collection sessions loaded',
            data: rows,
        }
    } catch (err) {
        return handleDBError(err, 'Load collection sessions')
    }
}

export const deleteSessionHistory = async (sessionId: number) => {
    try {
        const result = await db.runAsync(
            `DELETE FROM session_histories
             WHERE id = ?`,
            [sessionId]
        )

        if (result.changes === 0) {
            return {
                success: false,
                message: 'Session not found',
            }
        }

        return {
            success: true,
            message: 'Session deleted',
        }
    } catch (err) {
        return handleDBError(err, 'Delete session')
    }
}
