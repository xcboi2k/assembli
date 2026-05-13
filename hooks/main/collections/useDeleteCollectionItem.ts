import * as Sentry from '@sentry/react-native'

import UserStore from '@/stores/UserStore'
import LoaderStore from '@/stores/LoaderStore'
import { useToast } from '@/providers/ToastProvider'
import { deleteCollection } from '@/backend/collections/collections'

export default function useDeleteCollectionItem() {
    const user = UserStore((state) => state.user)
    const startLoading = LoaderStore((state) => state.startLoading)
    const stopLoading = LoaderStore((state) => state.stopLoading)

    const { showToast } = useToast()

    const deleteCollectionItem = async (id, goToNextScreen) => {
        startLoading()
        try {
            const response = await deleteCollection({
                id: Number(id),
                user_id: user?.id,
            })

            if (!response.success) {
                stopLoading()
                showToast(response.message, 'error')
                Sentry.captureException(
                    `Failed to delete collection for ${user?.username ?? 'unknown'}. ${response.message}`
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
                `Failed to delete collection for ${user?.username ?? 'unknown'}. Service not available right now. ${error}`
            )
            return null
        }
    }

    return { deleteCollectionItem }
}
