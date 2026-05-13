import { db } from '../db'
import { AppResponse, handleDBError } from '../error-system'

export const createTask = async (data: any): Promise<AppResponse<{ id: number }>> => {
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

        const result = await db.runAsync(
            `INSERT INTO tasks
             (collection_id, name, status)
             VALUES (?, ?, ?)`,
            [data.collection_id, data.name, data.status || 'pending']
        )

        return {
            success: true,
            message: 'Task created',
            data: { id: Number(result.lastInsertRowId) },
        }
    } catch (err) {
        return handleDBError(err, 'Create task')
    }
}

export const updateTask = async (data: any): Promise<AppResponse> => {
    try {
        if (!data.id) {
            return {
                success: false,
                message: 'Task id is required',
            }
        }

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

        const result = await db.runAsync(
            `UPDATE tasks SET name = ?, status = ? WHERE id = ? AND collection_id = ?`,
            [
                data.name,
                data.status || 'pending',
                data.id,
                data.collection_id,
            ]
        )

        if (result.changes === 0) {
            return {
                success: false,
                message: 'Task not found',
            }
        }

        return {
            success: true,
            message: 'Task updated',
        }
    } catch (err) {
        return handleDBError(err, 'Update task')
    }
}

export const deleteTask = async (data: any): Promise<AppResponse> => {
    try {
        if (!data.id) {
            return {
                success: false,
                message: 'Task id is required',
            }
        }

        if (!data.collection_id) {
            return {
                success: false,
                message: 'Collection is required',
            }
        }

        await db.runAsync(`DELETE FROM subtasks WHERE task_id = ?`, [data.id])

        const result = await db.runAsync(
            `DELETE FROM tasks WHERE id = ? AND collection_id = ?`,
            [data.id, data.collection_id]
        )

        if (result.changes === 0) {
            return {
                success: false,
                message: 'Task not found',
            }
        }

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
