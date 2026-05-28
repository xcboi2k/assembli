import { useState } from 'react'
import * as Sentry from '@sentry/react-native'

import UserStore from '@/stores/UserStore'
import { useToast } from '@/providers/ToastProvider'

import {
    getCollectionsByUserId,
    getCollectionById,
} from '@/backend/collections/collections'

import { getTasksByCollectionId } from '@/backend/collections/tasks'
import { getSubtasksByTaskId } from '@/backend/collections/subtasks'

type CollectionAnalytics = {
    totalCollections: number
    completedCollections: number

    totalTasks: number
    completedTasks: number

    totalSubtasks: number
    completedSubtasks: number

    overallCompletionRate: number
}

export default function useGetCollectionsTree() {
    const user = UserStore((state) => state.user)
    const { showToast } = useToast()

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<any[]>([])
    const [analytics, setAnalytics] = useState<CollectionAnalytics | null>(null)

    // -------------------------
    // INTERNAL: attach subtasks
    // -------------------------
    const attachSubtasks = async (tasks: any[]) => {
        return Promise.all(
            tasks.map(async (task) => {
                const res = await getSubtasksByTaskId(task.id)

                return {
                    ...task,
                    subtasks: res.success && res.data ? res.data : [],
                }
            })
        )
    }

    // -------------------------
    // INTERNAL: attach tasks
    // -------------------------
    const attachTasks = async (collectionId: number) => {
        const res = await getTasksByCollectionId(collectionId)

        if (!res.success || !res.data) return []

        return attachSubtasks(res.data)
    }

    // -------------------------
    // INTERNAL: build full tree
    // -------------------------
    const buildTree = async (collections: any[]) => {
        return Promise.all(
            collections.map(async (collection) => ({
                ...collection,
                tasks: await attachTasks(collection.id),
            }))
        )
    }

    const generateCollectionAnalytics = (collections: any[]) => {
        let totalCollections = collections.length
        let completedCollections = 0

        let totalTasks = 0
        let completedTasks = 0

        let totalSubtasks = 0
        let completedSubtasks = 0

        collections.forEach((collection) => {
            if (collection.status === 'completed') {
                completedCollections++
            }

            collection.tasks?.forEach((task: any) => {
                totalTasks++

                if (task.status === 'completed') {
                    completedTasks++
                }

                task.subtasks?.forEach((subtask: any) => {
                    totalSubtasks++

                    if (subtask.status === 'completed') {
                        completedSubtasks++
                    }
                })
            })
        })

        const totalItems = totalTasks + totalSubtasks

        const completedItems = completedTasks + completedSubtasks

        const overallCompletionRate =
            totalItems === 0
                ? 0
                : Math.round((completedItems / totalItems) * 100)

        return {
            totalCollections,
            completedCollections,

            totalTasks,
            completedTasks,

            totalSubtasks,
            completedSubtasks,

            overallCompletionRate,
        }
    }
    // -------------------------
    // GET ALL COLLECTIONS (BY USER)
    // -------------------------
    const getByUserId = async (
        userId?: number,
        searchText?: string,
        categoryId?: number | null
    ) => {
        setLoading(true)

        try {
            const res = await getCollectionsByUserId(userId ?? user?.id, {
                search: searchText,
                category_id: categoryId ? categoryId : undefined,
            })

            if (!res.success || !res.data) {
                showToast(res.message, 'error')
                Sentry.captureException(res.message)
                setData([])
                return
            }

            const tree = await buildTree(res.data)
            const generatedAnalytics = generateCollectionAnalytics(tree)

            setAnalytics(generatedAnalytics)
            setData(tree)
        } catch (error) {
            Sentry.captureException(error)
            showToast('Service not available right now.', 'error')
            setData([])
        } finally {
            setLoading(false)
        }
    }

    // -------------------------
    // GET SINGLE COLLECTION
    // -------------------------
    const getByCollectionId = async (collectionId: number) => {
        setLoading(true)

        try {
            const res = await getCollectionById(collectionId)
            console.log(res)

            if (!res.success || !res.data) {
                showToast(res.message, 'error')
                setData([])
                return
            }

            const tree = {
                ...res.data,
                tasks: await attachTasks(res.data.id),
            }

            setData([tree])
        } catch (error) {
            Sentry.captureException(error)
            showToast('Service not available right now.', 'error')
            setData([])
        } finally {
            setLoading(false)
        }
    }

    // -------------------------
    // RETURN
    // -------------------------
    return {
        data,
        loading,
        getByUserId,
        getByCollectionId,
        analytics,
    }
}
