import useUpdateTask from '@/hooks/main/tasks/useUpdateTask'
import React from 'react'

export async function syncTaskStatusFromSubtasks(task, collectionId) {
    const subtasks = task.subtasks || []

    const { updateTaskStatusRecord } = useUpdateTask()

    const total = subtasks.length
    const completed = subtasks.filter((s) => s.status === 'COMPLETED').length
    const inProgress = subtasks.filter((s) => s.status === 'IN_PROGRESS').length
    const pending = subtasks.filter((s) => s.status === 'PENDING').length

    // ALL COMPLETED
    if (completed === total) {
        const completedDate = new Date().toISOString()
        updateTaskStatusRecord(
            task.id,
            collectionId,
            'COMPLETED',
            completedDate
        )
    }
    // ANY IN PROGRESS
    else if (inProgress > 0) {
        updateTaskStatusRecord(task.id, collectionId, 'IN_PROGRESS', null)
    }
    // ALL PENDING
    else if (pending === total) {
        updateTaskStatusRecord(task.id, collectionId, 'PENDING', null)
    }
    // MIXED (fallback)
    else {
        updateTaskStatusRecord(task.id, collectionId, 'PENDING', null)
    }
}
