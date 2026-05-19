/**
 * Computes overall progress percentage.
 *
 * Rules:
 * - COMPLETED = 100%
 * - IN_PROGRESS = 50%
 * - PENDING = 0%
 *
 * If task has subtasks:
 * - progress is based on subtasks
 *
 * If task has no subtasks:
 * - progress is based on task status
 *
 * Returns decimal percentage (0 - 100)
 */
export const computeBuildProgress = (tasks) => {
    if (!tasks.length) return 0

    let total = 0
    let completed = 0

    const getStatusValue = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 1
            case 'IN_PROGRESS':
                return 0.5
            default:
                return 0
        }
    }

    for (const task of tasks) {
        if (task.subtasks?.length) {
            for (const subtask of task.subtasks) {
                total += 1
                completed += getStatusValue(subtask.status)
            }
        } else {
            total += 1
            completed += getStatusValue(task.status)
        }
    }

    if (total === 0) return 0

    return Number((completed / total).toFixed(2))
}
