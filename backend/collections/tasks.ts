import { db } from '../db'
import { AppResponse, handleDBError } from '../error-system'
import { createHistory } from './session-histories'

export const createTask = async (
    data: any
): Promise<AppResponse<{ id: number }>> => {
    try {
        if (!data.collection_id) {
            return {
                success: false,
                message: 'Collection is required',
            }
        }

        if (!data.name) {
            return {
                success: false,
                message: 'Task name is required',
            }
        }

        const createdAt = new Date().toISOString()

        const result = await db.runAsync(
            `INSERT INTO tasks
             (collection_id, name, status, created_at)
             VALUES (?, ?, ?)`,
            [data.collection_id, data.name, data.status || 'pending', createdAt]
        )

        await createHistory({
            user_id: data.user_id,
            task_id: result.lastInsertRowId,
            collection_id: data.collection_id,
            action: 'create',
            details: `Created task "${data.name}"`,
        })

        return {
            success: true,
            message: 'Task created',
            data: { id: Number(result.lastInsertRowId) },
        }
    } catch (err) {
        return handleDBError(err, 'Create task')
    }
}

export const updateTaskName = async (
    userId: number,
    taskId: number,
    collectionId: number,
    name: string
): Promise<AppResponse> => {
    try {
        if (!taskId) {
            return {
                success: false,
                message: 'Task id is required',
            }
        }

        if (!name.trim()) {
            return {
                success: false,
                message: 'Task name is required',
            }
        }

        const result = await db.runAsync(
            `UPDATE tasks
             SET name = ?
             WHERE id = ?`,
            [name.trim(), taskId]
        )

        if (result.changes === 0) {
            return {
                success: false,
                message: 'Task not found',
            }
        }

        await createHistory({
            user_id: userId,
            task_id: taskId,
            collection_id: collectionId,
            action: 'content_update',
            details: `Updated task`,
        })

        return {
            success: true,
            message: 'Task name updated',
        }
    } catch (err) {
        return handleDBError(err, 'Update task name')
    }
}

export const updateTaskStatus = async (
    userId: number,
    collectionId: number,
    taskId: number,
    status: string,
    completedAt: string | null = null
): Promise<AppResponse> => {
    try {
        if (!taskId) {
            return {
                success: false,
                message: 'Task id is required',
            }
        }

        if (!status.trim()) {
            return {
                success: false,
                message: 'Task status is required',
            }
        }

        const result = await db.runAsync(
            `UPDATE tasks
             SET status = ?,
                 completed_at = ?
             WHERE id = ?`,
            [status, completedAt, taskId]
        )

        if (result.changes === 0) {
            return {
                success: false,
                message: 'Task not found',
            }
        }

        await createHistory({
            user_id: userId,
            task_id: taskId,
            collection_id: collectionId,
            action: 'status_update',
            details: `Updated task status to "${status}"`,
        })

        return {
            success: true,
            message: 'Task status updated',
        }
    } catch (err) {
        return handleDBError(err, 'Update task status')
    }
}

export const deleteTask = async (
    userId: number,
    taskId: number,
    collectionId: number
): Promise<AppResponse> => {
    try {
        const result = await db.runAsync(`DELETE FROM tasks WHERE id = ?`, [
            taskId,
        ])

        if (result.changes === 0) {
            return {
                success: false,
                message: 'Task not found',
            }
        }

        await createHistory({
            user_id: userId,
            task_id: taskId,
            collection_id: collectionId,
            action: 'delete',
            details: `Deleted task`,
        })

        return {
            success: true,
            message: 'Task deleted',
        }
    } catch (err) {
        return handleDBError(err, 'Delete task')
    }
}

export const getTasksByCollectionId = async (
    collectionId: number
): Promise<AppResponse<any[]>> => {
    try {
        if (collectionId == null || Number.isNaN(Number(collectionId))) {
            return {
                success: false,
                message: 'Collection is required',
            }
        }

        const rows = await db.getAllAsync(
            `SELECT * FROM tasks WHERE collection_id = ? ORDER BY id ASC`,
            [collectionId]
        )

        return {
            success: true,
            message: 'Tasks loaded',
            data: rows as any[],
        }
    } catch (err) {
        return handleDBError(err, 'Load tasks')
    }
}
