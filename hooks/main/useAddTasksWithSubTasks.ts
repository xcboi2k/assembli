import * as Sentry from '@sentry/react-native'

import UserStore from '@/stores/UserStore'
import LoaderStore from '@/stores/LoaderStore'

import { useToast } from '@/providers/ToastProvider'

import { createTask } from '@/backend/collections/tasks'
import { createSubtask } from '@/backend/collections/subtasks'

export default function useAddTaskWithSubtasks() {
    const user = UserStore((state) => state.user)

    const startLoading = LoaderStore((state) => state.startLoading)

    const stopLoading = LoaderStore((state) => state.stopLoading)

    const { showToast } = useToast()

    const addTasksWithSubtasks = async (payload, goToNextScreen) => {
        startLoading()

        try {
            for (const task of payload.tasks) {
                /**
                 * CREATE TASK
                 */
                const taskResponse = await createTask({
                    collection_id: payload.collection_id,

                    name: task.title,
                    status: 'PENDING',
                })

                console.log('add tasks response', taskResponse)
                if (!taskResponse.success || !taskResponse.data) {
                    showToast(taskResponse.message, 'error')
                    Sentry.captureException(
                        `Failed to create task for ${user?.username ?? 'unknown'}. ${taskResponse.message}`
                    )
                    stopLoading()
                    return
                }

                const taskId = taskResponse.data.id

                /**
                 * CREATE SUBTASKS
                 */
                await Promise.all(
                    task.subtasks.map(async (subtask) => {
                        const subtaskResponse = await createSubtask({
                            task_id: taskId,
                            name: subtask.title,
                            status: 'PENDING',
                        })

                        if (!subtaskResponse.success || !subtaskResponse.data) {
                            showToast(subtaskResponse.message, 'error')
                            Sentry.captureException(
                                `Failed to create subtask for ${user?.username ?? 'unknown'}. ${subtaskResponse.message}`
                            )
                            stopLoading()
                            return
                        }
                    })
                )
            }

            stopLoading()

            showToast('Tasks added successfully.', 'success')
            goToNextScreen()
        } catch (error) {
            stopLoading()

            showToast('Service not available right now.', 'error')
            Sentry.captureException(
                `Failed to create tasks and subtasks for ${user?.username ?? 'unknown'}. 'Service not available right now. ${error}`
            )
        }
    }

    return {
        addTasksWithSubtasks,
    }
}
