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

export default function useGetCollectionsTree() {
    const user = UserStore((state) => state.user)
    const { showToast } = useToast()

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<any[]>([])

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

    // -------------------------
    // GET ALL COLLECTIONS (BY USER)
    // -------------------------
    const getByUserId = async (userId?: number) => {
        setLoading(true)

        try {
            const res = await getCollectionsByUserId(userId ?? user?.id)

            if (!res.success || !res.data) {
                showToast(res.message, 'error')
                Sentry.captureException(res.message)
                setData([])
                return
            }

            const tree = await buildTree(res.data)
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
    }
}
