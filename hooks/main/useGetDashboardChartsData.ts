import { useEffect, useMemo, useState } from 'react'
import * as Sentry from '@sentry/react-native'

import UserStore from '@/stores/UserStore'
import useGetCollectionsTree from './useGetCollectionsTree'

const getStatusValue = (status?: string) => {
    switch (status) {
        case 'COMPLETED':
            return 1
        case 'IN_PROGRESS':
            return 0.5
        default:
            return 0
    }
}

const calculateItemProgress = (item: any) => {
    if (!item) return 0

    let total = 0
    let completed = 0

    const tasks = item.tasks ?? []

    for (const task of tasks) {
        const subtasks = task.subtasks ?? []

        if (subtasks.length) {
            for (const sub of subtasks) {
                total += 1
                completed += getStatusValue(sub.status)
            }
        } else {
            total += 1
            completed += getStatusValue(task.status)
        }
    }

    if (!total) return 0

    return Number(((completed / total) * 100).toFixed(2))
}

export default function useGetDashboardChartsData() {
    const user = UserStore((state) => state.user)
    const { data = [], getByUserId } = useGetCollectionsTree()

    const [loading, setLoading] = useState(false)

    // Fetch data
    useEffect(() => {
        if (!user?.id) return

        const fetch = async () => {
            try {
                setLoading(true)
                await getByUserId(user.id)
            } catch (err) {
                Sentry.captureException(err)
            } finally {
                setLoading(false)
            }
        }

        fetch()
    }, [user?.id])

    const analytics = useMemo(() => {
        if (!data.length) {
            return {
                highest: null,
                lowest: null,
                recentCompleted: null,
                heatMapData: [],
                stats: {
                    acquired: 0,
                    ongoing: 0,
                    completed: 0,
                },
            }
        }

        const scored = data.map((item) => ({
            item,
            progress: calculateItemProgress(item),
        }))

        // -------------------------
        // Highest / Lowest
        // -------------------------
        const sorted = [...scored].sort((a, b) => b.progress - a.progress)

        const highest = sorted[0] ?? null

        const lowest = [...sorted].reverse().find((x) => x.progress > 0) ?? null

        // -------------------------
        // Recent completed
        // -------------------------
        const recentCompleted =
            [...data]
                .filter((item) => item.completed_at)
                .sort(
                    (a, b) =>
                        new Date(b.completed_at).getTime() -
                        new Date(a.completed_at).getTime()
                )[0] ?? null

        // -------------------------
        // Heatmap
        // -------------------------
        const heatMapData = (() => {
            const map = new Map<string, number>()

            for (const { item, progress } of scored) {
                const date = item.updated_at?.split('T')[0]
                if (!date) continue

                const value =
                    progress >= 100
                        ? 4
                        : progress >= 75
                          ? 3
                          : progress >= 50
                            ? 2
                            : progress > 0
                              ? 1
                              : 0

                map.set(date, Math.max(map.get(date) ?? 0, value))
            }

            return Array.from({ length: 35 }).map((_, i) => {
                const d = new Date()
                d.setDate(d.getDate() - (34 - i))

                const date = d.toISOString().split('T')[0]

                return {
                    date,
                    value: map.get(date) ?? 0,
                }
            })
        })()

        // -------------------------
        // Stats (NEW)
        // -------------------------
        const allTasks = data.flatMap((c) => c.tasks ?? [])

        const stats = allTasks.reduce(
            (acc, task) => {
                if (task.status === 'COMPLETED') {
                    acc.completed += 1
                } else if (task.status === 'IN_PROGRESS') {
                    acc.ongoing += 1
                } else {
                    acc.acquired += 1
                }

                return acc
            },
            {
                acquired: 0,
                ongoing: 0,
                completed: 0,
            }
        )

        return {
            highest,
            lowest,
            recentCompleted,
            heatMapData,
            stats,
        }
    }, [data])

    const refetch = async () => {
        if (!user?.id) return

        try {
            setLoading(true)
            await getByUserId(user.id)
        } catch (err) {
            Sentry.captureException(err)
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        analytics,
        refetch,
    }
}
