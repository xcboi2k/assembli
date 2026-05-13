import * as Sentry from '@sentry/react-native'

import UserStore from '@/stores/UserStore'
import LoaderStore from '@/stores/LoaderStore'
import { useToast } from '@/providers/ToastProvider'
import { deleteCategory as deleteCategoryRecord } from '@/backend/categories/categories'

export default function useDeleteCategory() {
    const user = UserStore((state) => state.user)
    const startLoading = LoaderStore((state) => state.startLoading)
    const stopLoading = LoaderStore((state) => state.stopLoading)

    const { showToast } = useToast()

    const deleteCategory = async (id, goToNextScreen) => {
        startLoading()
        try {
            const response = await deleteCategoryRecord(Number(id))

            if (!response.success) {
                stopLoading()
                showToast(response.message, 'error')
                Sentry.captureException(
                    `Failed to delete category for ${user?.username ?? 'unknown'}. ${response.message}`
                )
                return response
            } else {
                stopLoading()
                showToast(response.message, 'success')
                goToNextScreen()
                return response
            }
        } catch (error) {
            stopLoading()
            await new Promise((resolve) => setTimeout(resolve, 100))
            showToast(`Service not available right now.`, 'error')
            Sentry.captureException(
                `Failed to delete category for ${user?.username ?? 'unknown'}. Service not available right now. ${error}`
            )
            return null
        }
    }

    return { deleteCategory }
}
