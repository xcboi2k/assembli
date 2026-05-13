import * as Sentry from '@sentry/react-native'

import UserStore from '@/stores/UserStore'
import LoaderStore from '@/stores/LoaderStore'
import { useToast } from '@/providers/ToastProvider'
import { updateTask as updateTaskRecord } from '@/backend/collections/tasks'

export default function useUpdateTask() {
    const user = UserStore((state) => state.user)
    const startLoading = LoaderStore((state) => state.startLoading)
    const stopLoading = LoaderStore((state) => state.stopLoading)

    const { showToast } = useToast()

    const updateTask = async (id, values, resetForm, goToNextScreen) => {
        startLoading()
        try {
            const response = await updateTaskRecord({
                id: Number(id),
                collection_id: values.collection_id,
                name: values.name,
                status: values.status,
            })

            if (!response.success) {
                stopLoading()
                showToast(response.message, 'error')
                Sentry.captureException(
                    `Failed to update task for ${user?.username ?? 'unknown'}. ${response.message}`
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
                `Failed to update task for ${user?.username ?? 'unknown'}. Service not available right now. ${error}`
            )
        }
    }

    return { updateTask }
}
