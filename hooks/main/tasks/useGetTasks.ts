import { useState } from 'react'
import * as Sentry from '@sentry/react-native'

import UserStore from '@/stores/UserStore'
import { useToast } from '@/providers/ToastProvider'
import { getTasksByCollectionId } from '@/backend/collections/tasks'

export default function useGetTasks() {
    const user = UserStore((state) => state.user)

    const { showToast } = useToast()

    const [loading, setLoading] = useState(false)
    const [tasks, setTasks] = useState<any[] | null>(null)

    const getTasks = async (collectionId: number) => {
        setLoading(true)
        try {
            const response = await getTasksByCollectionId(collectionId)

            if (!response.success || response.data == null) {
                setLoading(false)
                showToast(response.message, 'error')
                Sentry.captureException(
                    `Failed to fetch tasks for ${user?.username ?? 'unknown'}. ${response.message}`
                )
                setTasks([])
            } else {
                setTasks(response.data)
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            await new Promise((resolve) => setTimeout(resolve, 100))
            showToast(`Service not available right now.`, 'error')
            Sentry.captureException(
                `Failed to fetch tasks for ${user?.username ?? 'unknown'}. Service not available right now. ${error}`
            )
            setTasks([])
        }
    }

    return { tasks, loading, getTasks }
}
