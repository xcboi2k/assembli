import { db } from '../db'
import { AppResponse, handleDBError } from '../error-system'

export const createSubtask = async (data: any): Promise<AppResponse<{ id: number }>> => {
    try {
        if (!data.task_id) {
            return {
                success: false,
                message: 'Task is required',
            }
        }

        if (!data.name) {
            return {
                success: false,
                message: 'Subtask name is required',
            }
        }

        const result = await db.runAsync(
            `INSERT INTO subtasks
             (task_id, name, status)
             VALUES (?, ?, ?)`,
            [data.task_id, data.name, data.status || 'pending']
        )

        return {
            success: true,
            message: 'Subtask created',
            data: { id: Number(result.lastInsertRowId) },
        }
    } catch (err) {
        return handleDBError(err, 'Create subtask')
    }
}

export const updateSubtask = async (data: any): Promise<AppResponse> => {
    try {
        if (!data.id) {
            return {
                success: false,
                message: 'Subtask id is required',
            }
        }

        if (!data.task_id) {
            return {
                success: false,
                message: 'Task is required',
            }
        }

        if (!data.name) {
            return {
                success: false,
                message: 'Subtask name is required',
            }
        }

        const result = await db.runAsync(
            `UPDATE subtasks SET name = ?, status = ? WHERE id = ? AND task_id = ?`,
            [
                data.name,
                data.status || 'pending',
                data.id,
                data.task_id,
            ]
        )

        if (result.changes === 0) {
            return {
                success: false,
                message: 'Subtask not found',
            }
        }

        return {
            success: true,
            message: 'Subtask updated',
        }
    } catch (err) {
        return handleDBError(err, 'Update subtask')
    }
}

export const deleteSubtask = async (data: any): Promise<AppResponse> => {
    try {
        if (!data.id) {
            return {
                success: false,
                message: 'Subtask id is required',
            }
        }

        if (!data.task_id) {
            return {
                success: false,
                message: 'Task is required',
            }
        }

        const result = await db.runAsync(
            `DELETE FROM subtasks WHERE id = ? AND task_id = ?`,
            [data.id, data.task_id]
        )

        if (result.changes === 0) {
            return {
                success: false,
                message: 'Subtask not found',
            }
        }

        return {
            success: true,
            message: 'Subtask deleted',
        }
    } catch (err) {
        return handleDBError(err, 'Delete subtask')
    }
}

export const getSubtasksByTaskId = async (
    taskId: number
): Promise<AppResponse<any[]>> => {
    try {
        if (taskId == null || Number.isNaN(Number(taskId))) {
            return {
                success: false,
                message: 'Task is required',
            }
        }

        const rows = await db.getAllAsync(
            `SELECT * FROM subtasks WHERE task_id = ? ORDER BY id ASC`,
            [taskId]
        )

        return {
            success: true,
            message: 'Subtasks loaded',
            data: rows as any[],
        }
    } catch (err) {
        return handleDBError(err, 'Load subtasks')
    }
}
