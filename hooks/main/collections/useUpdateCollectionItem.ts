import * as Sentry from '@sentry/react-native'

import UserStore from '@/stores/UserStore'
import LoaderStore from '@/stores/LoaderStore'
import { useToast } from '@/providers/ToastProvider'
import { updateCollection } from '@/backend/collections/collections'

export default function useUpdateCollectionItem() {
    const user = UserStore((state) => state.user)
    const startLoading = LoaderStore((state) => state.startLoading)
    const stopLoading = LoaderStore((state) => state.stopLoading)

    const { showToast } = useToast()

    const updateCollectionItem = async (
        id,
        values,
        resetForm,
        goToNextScreen
    ) => {
        startLoading()
        try {
            const response = await updateCollection({
                id: Number(id),
                user_id: values.user_id ?? user?.id,
                name: values.name ?? values.collectionItemName,
                series: values.series ?? values.collectionItemSeries ?? null,
                category: values.category ?? values.category_name ?? null,
                procurement_date:
                    values.procurement_date ?? values.procurementDate ?? null,
            })

            if (!response.success) {
                stopLoading()
                showToast(response.message, 'error')
                Sentry.captureException(
                    `Failed to update collection for ${user?.username ?? 'unknown'}. ${response.message}`
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
                `Failed to update collection for ${user?.username ?? 'unknown'}. Service not available right now. ${error}`
            )
        }
    }

    return { updateCollectionItem }
}
