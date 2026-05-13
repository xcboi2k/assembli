import { useState } from 'react'
import * as Sentry from '@sentry/react-native'

import UserStore from '@/stores/UserStore'
import { useToast } from '@/providers/ToastProvider'
import { getCategories } from '@/backend/categories/categories'

export default function useGetCategories() {
    const user = UserStore((state) => state.user)

    const { showToast } = useToast()

    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<any[] | null>(null)

    const fetchCategories = async () => {
        setLoading(true)
        try {
            const response = await getCategories()

            if (!response.success) {
                setLoading(false)
                showToast(response.message, 'error')
                Sentry.captureException(
                    `Failed to fetch categories for ${user?.username ?? 'unknown'}. ${response.message}`
                )
                setCategories(response.data ?? [])
            } else {
                setCategories(response.data ?? [])
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            await new Promise((resolve) => setTimeout(resolve, 100))
            showToast(`Service not available right now.`, 'error')
            Sentry.captureException(
                `Failed to fetch categories for ${user?.username ?? 'unknown'}. Service not available right now. ${error}`
            )
            setCategories([])
        }
    }

    return { categories, loading, fetchCategories }
}
