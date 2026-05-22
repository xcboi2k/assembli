import { db } from '../db'
import { AppResponse, handleDBError } from '../error-system'
import { createHistory } from './session-histories'

export const createSubtask = async (
    data: any
): Promise<AppResponse<{ id: number }>> => {
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

        const createdAt = new Date().toISOString()

        const result = await db.runAsync(
            `INSERT INTO subtasks
             (task_id, name, status)
             VALUES (?, ?, ?)`,
            [data.task_id, data.name, data.status || 'pending', createdAt]
        )

        await createHistory({
            user_id: data.user_id,
            task_id: result.lastInsertRowId,
            action: 'create',
            details: `Created subtask "${data.name}"`,
        })

        return {
            success: true,
            message: 'Subtask created',
            data: { id: Number(result.lastInsertRowId) },
        }
    } catch (err) {
        return handleDBError(err, 'Create subtask')
    }
}

export const updateSubtaskName = async (
    userId: number,
    taskId: number,
    subtaskId: number,
    name: string
): Promise<AppResponse> => {
    try {
        if (!subtaskId) {
            return {
                success: false,
                message: 'Subtask id is required',
            }
        }

        if (!name.trim()) {
            return {
                success: false,
                message: 'Subtask name is required',
            }
        }

        const result = await db.runAsync(
            `UPDATE subtasks
             SET name = ?
             WHERE id = ?`,
            [name.trim(), subtaskId]
        )

        if (result.changes === 0) {
            return {
                success: false,
                message: 'Subtask not found',
            }
        }

        await createHistory({
            user_id: userId,
            task_id: taskId,
            subtask_id: subtaskId,
            action: 'content_update',
            details: `Updated task`,
        })

        return {
            success: true,
            message: 'Subtask name updated',
        }
    } catch (err) {
        return handleDBError(err, 'Update subtask name')
    }
}

export const updateSubtaskStatus = async (
    userId: number,
    taskId: number,
    subtaskId: number,
    status: string,
    completedAt: string | null = null
): Promise<AppResponse> => {
    try {
        if (!subtaskId) {
            return {
                success: false,
                message: 'Subtask id is required',
            }
        }

        if (!status.trim()) {
            return {
                success: false,
                message: 'Subtask status is required',
            }
        }

        const result = await db.runAsync(
            `UPDATE subtasks
             SET status = ?
             WHERE id = ?`,
            [status, completedAt, subtaskId]
        )

        if (result.changes === 0) {
            return {
                success: false,
                message: 'Subtask not found',
            }
        }

        await createHistory({
            user_id: userId,
            task_id: taskId,
            subtask_id: subtaskId,
            action: 'status_update',
            details: `Updated subtask status to "${status}"`,
        })

        return {
            success: true,
            message: 'Subtask status updated',
        }
    } catch (err) {
        return handleDBError(err, 'Update subtask status')
    }
}

export const deleteSubtask = async (
    userId: number,
    taskId: number,
    subtaskId: number
): Promise<AppResponse> => {
    try {
        if (!subtaskId) {
            return {
                success: false,
                message: 'Subtask id is required',
            }
        }

        const result = await db.runAsync(
            `DELETE FROM subtasks
             WHERE id = ?`,
            [subtaskId]
        )

        if (result.changes === 0) {
            return {
                success: false,
                message: 'Subtask not found',
            }
        }

        await createHistory({
            user_id: userId,
            subtask_id: subtaskId,
            task_id: taskId,
            action: 'delete',
            details: `Deleted subtask`,
        })

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
