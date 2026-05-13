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
    const [chartData, setChartData] = useState<
        { category: string; amount: number; icon: string; color: string }[] | null
    >(null)

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
                setChartData([])
            } else {
                const rows = response.data
                setData(rows)

                const categoryData: {
                    category: string
                    amount: number
                    icon: string
                    color: string
                }[] = []

                rows.forEach((item: any) => {
                    const category = item.category ?? 'Uncategorized'
                    const amount = 1
                    const icon = 'package'
                    const color = '#3B82F6'

                    const existingCategory = categoryData.find(
                        (c) => c.category === category
                    )

                    if (existingCategory) {
                        existingCategory.amount += amount
                    } else {
                        categoryData.push({ category, amount, icon, color })
                    }
                })

                setChartData(categoryData)
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
            setChartData([])
        }
    }

    return { data, chartData, loading, getCollectionItems }
}
