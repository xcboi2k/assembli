import * as Sentry from '@sentry/react-native'

import UserStore from '@/stores/UserStore'
import LoaderStore from '@/stores/LoaderStore'
import { useToast } from '@/providers/ToastProvider'
import { updateTaskName, updateTaskStatus } from '@/backend/collections/tasks'

export default function useUpdateTask() {
    const user = UserStore((state) => state.user)
    const startLoading = LoaderStore((state) => state.startLoading)
    const stopLoading = LoaderStore((state) => state.stopLoading)

    const { showToast } = useToast()

    const updateTaskNameRecord = async (
        id,
        collectionId,
        name,
        goToNextScreen
    ) => {
        startLoading()
        try {
            const response = await updateTaskName(
                Number(user.user_id),
                Number(id),
                Number(collectionId),
                name
            )

            if (!response.success) {
                stopLoading()
                showToast(response.message, 'error')
                Sentry.captureException(
                    `Failed to update task name for ${user?.username ?? 'unknown'}. ${response.message}`
                )
            } else {
                stopLoading()
                showToast(response.message, 'success')
                goToNextScreen()
            }
        } catch (error) {
            stopLoading()
            await new Promise((resolve) => setTimeout(resolve, 100))
            showToast(`Service not available right now.`, 'error')
            Sentry.captureException(
                `Failed to update task name for ${user?.username ?? 'unknown'}. Service not available right now. ${error}`
            )
        }
    }

    const updateTaskStatusRecord = async (
        id,
        collectionId,
        status,
        completedDate
    ) => {
        try {
            const response = await updateTaskStatus(
                Number(user.user_id),
                Number(id),
                Number(collectionId),
                status,
                completedDate
            )

            if (!response.success) {
                Sentry.captureException(
                    `Failed to update task status for ${user?.username ?? 'unknown'}. ${response.message}`
                )
            }
        } catch (error) {
            Sentry.captureException(
                `Failed to update task status for ${user?.username ?? 'unknown'}. Service not available right now. ${error}`
            )
        }
    }

    return { updateTaskNameRecord, updateTaskStatusRecord }
}
