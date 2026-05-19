import { useState } from 'react'
import * as Sentry from '@sentry/react-native'

import UserStore from '@/stores/UserStore'
import { useToast } from '@/providers/ToastProvider'
import { getCollectionsByUserId } from '@/backend/collections/collections'

export default function useGetCollectionItems() {
    const user = UserStore((state) => state.user)

    const { showToast } = useToast()

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<any[] | null>(null)

    const getCollectionItems = async () => {
        setLoading(true)
        try {
            const response = await getCollectionsByUserId(user?.id)

            if (!response.success || !response.data) {
                setLoading(false)
                showToast(response.message, 'error')
                Sentry.captureException(
                    `Failed to fetch collections for ${user?.username ?? 'unknown'}. ${response.message}`
                )
                setData([])
            } else {
                const rows = response.data
                setData(rows)
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            await new Promise((resolve) => setTimeout(resolve, 100))
            showToast(`Service not available right now.`, 'error')
            Sentry.captureException(
                `Failed to fetch collections for ${user?.username ?? 'unknown'}. Service not available right now. ${error}`
            )
            setData([])
        }
    }

    return { data, loading, getCollectionItems }
}
