import { useState } from 'react'
import * as Sentry from '@sentry/react-native'

import UserStore from '@/stores/UserStore'
import { useToast } from '@/providers/ToastProvider'

import { getTasksByCollectionId } from '@/backend/collections/tasks'
import { getSubtasksByTaskId } from '@/backend/collections/subtasks'

export default function useGetTasksWithSubtasks() {
    const user = UserStore((state) => state.user)

    const { showToast } = useToast()

    const [loading, setLoading] = useState(false)

    const [tasks, setTasks] = useState<any[]>([])

    const getTasksWithSubtasks = async (collectionId: number) => {
        setLoading(true)

        try {
            // 1. GET TASKS
            const taskResponse = await getTasksByCollectionId(collectionId)

            if (!taskResponse.success || !taskResponse.data) {
                showToast(taskResponse.message, 'error')

                setTasks([])
                setLoading(false)

                return
            }

            const tasksData = taskResponse.data

            // 2. GET SUBTASKS FOR EACH TASK
            const tasksWithSubtasks = await Promise.all(
                tasksData.map(async (task) => {
                    const subtaskResponse = await getSubtasksByTaskId(task.id)

                    return {
                        ...task,
                        subtasks:
                            subtaskResponse.success && subtaskResponse.data
                                ? subtaskResponse.data
                                : [],
                    }
                })
            )

            // 3. SAVE MERGED DATA
            setTasks(tasksWithSubtasks)
        } catch (error) {
            showToast('Service not available right now.', 'error')

            Sentry.captureException(
                `Failed to fetch tasks/subtasks for ${
                    user?.username ?? 'unknown'
                }. ${error}`
            )

            setTasks([])
        } finally {
            setLoading(false)
        }
    }

    return {
        tasks,
        loading,
        getTasksWithSubtasks,
    }
}
