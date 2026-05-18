import * as Sentry from '@sentry/react-native'

import UserStore from '@/stores/UserStore'
import LoaderStore from '@/stores/LoaderStore'
import { useToast } from '@/providers/ToastProvider'
import { deleteSubtask as deleteSubtaskRecord } from '@/backend/collections/subtasks'

export default function useDeleteSubtask() {
    const user = UserStore((state) => state.user)
    const startLoading = LoaderStore((state) => state.startLoading)
    const stopLoading = LoaderStore((state) => state.stopLoading)

    const { showToast } = useToast()

    const deleteSubtask = async (id, goToNextScreen) => {
        startLoading()
        try {
            const response = await deleteSubtaskRecord(Number(id))

            if (!response.success) {
                stopLoading()
                showToast(response.message, 'error')
                Sentry.captureException(
                    `Failed to delete subtask for ${user?.username ?? 'unknown'}. ${response.message}`
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
                `Failed to delete subtask for ${user?.username ?? 'unknown'}. Service not available right now. ${error}`
            )
        }
    }

    return { deleteSubtask }
}
