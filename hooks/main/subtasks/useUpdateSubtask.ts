import * as Sentry from '@sentry/react-native'

import UserStore from '@/stores/UserStore'
import LoaderStore from '@/stores/LoaderStore'
import { useToast } from '@/providers/ToastProvider'
import { updateSubtask as updateSubtaskRecord } from '@/backend/collections/subtasks'

export default function useUpdateSubtask() {
    const user = UserStore((state) => state.user)
    const startLoading = LoaderStore((state) => state.startLoading)
    const stopLoading = LoaderStore((state) => state.stopLoading)

    const { showToast } = useToast()

    const updateSubtask = async (id, values, resetForm, goToNextScreen) => {
        startLoading()
        try {
            const response = await updateSubtaskRecord({
                id: Number(id),
                task_id: values.task_id,
                name: values.name,
                status: values.status,
            })

            if (!response.success) {
                stopLoading()
                showToast(response.message, 'error')
                Sentry.captureException(
                    `Failed to update subtask for ${user?.username ?? 'unknown'}. ${response.message}`
                )
            } else {
                resetForm()
                stopLoading()
                showToast(response.message, 'success')
                goToNextScreen()
            }
        } catch (error) {
            stopLoading()
            await new Promise((resolve) => setTimeout(resolve, 100))
            showToast(`Service not available right now.`, 'error')
            Sentry.captureException(
                `Failed to update subtask for ${user?.username ?? 'unknown'}. Service not available right now. ${error}`
            )
        }
    }

    return { updateSubtask }
}
