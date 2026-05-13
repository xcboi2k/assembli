import { useState } from 'react'
import * as Sentry from '@sentry/react-native'

import UserStore from '@/stores/UserStore'
import { useToast } from '@/providers/ToastProvider'
import { getSubtasksByTaskId } from '@/backend/collections/subtasks'

export default function useGetSubtasks() {
    const user = UserStore((state) => state.user)

    const { showToast } = useToast()

    const [loading, setLoading] = useState(false)
    const [subtasks, setSubtasks] = useState<any[] | null>(null)

    const getSubtasks = async (taskId: number) => {
        setLoading(true)
        try {
            const response = await getSubtasksByTaskId(taskId)

            if (!response.success || response.data == null) {
                setLoading(false)
                showToast(response.message, 'error')
                Sentry.captureException(
                    `Failed to fetch subtasks for ${user?.username ?? 'unknown'}. ${response.message}`
                )
                setSubtasks([])
            } else {
                setSubtasks(response.data)
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            await new Promise((resolve) => setTimeout(resolve, 100))
            showToast(`Service not available right now.`, 'error')
            Sentry.captureException(
                `Failed to fetch subtasks for ${user?.username ?? 'unknown'}. Service not available right now. ${error}`
            )
            setSubtasks([])
        }
    }

    return { subtasks, loading, getSubtasks }
}
