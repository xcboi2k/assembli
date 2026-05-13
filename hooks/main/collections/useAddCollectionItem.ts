import * as Sentry from '@sentry/react-native'

import UserStore from '@/stores/UserStore'
import LoaderStore from '@/stores/LoaderStore'
import { useToast } from '@/providers/ToastProvider'
import { createCollection } from '@/backend/collections/collections'

export default function useAddCollectionItem() {
    const user = UserStore((state) => state.user)
    const startLoading = LoaderStore((state) => state.startLoading)
    const stopLoading = LoaderStore((state) => state.stopLoading)

    const { showToast } = useToast()

    const addCollectionItem = async (values, resetForm, goToNextScreen) => {
        startLoading()
        try {
            const response = await createCollection({
                user_id: values.user_id ?? user?.id,
                name: values.name,
                series: values.series,
                category: values.category,
                procurement_date: values.procurement_date,
            })

            if (!response.success) {
                stopLoading()
                showToast(response.message, 'error')
                Sentry.captureException(
                    `Failed to add collection for ${user?.username ?? 'unknown'}. ${response.message}`
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
                `Failed to add collection for ${user?.username ?? 'unknown'}. Service not available right now. ${error}`
            )
        }
    }

    return { addCollectionItem }
}
