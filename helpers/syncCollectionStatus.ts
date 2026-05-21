import { getTasksByCollectionId } from '@/backend/collections/tasks'
import useUpdateCollectionItem from '@/hooks/main/collections/useUpdateCollectionItem'

export const syncCollectionStatus = async (collectionId: number) => {
    const tasks = await getTasksByCollectionId(collectionId)

    const { updateCollectionItemStatus } = useUpdateCollectionItem()

    const total = tasks.length
    const completed = tasks.filter((s) => s.status === 'COMPLETED').length
    const inProgress = tasks.filter((s) => s.status === 'IN_PROGRESS').length
    const pending = tasks.filter((s) => s.status === 'PENDING').length

    let status = 'planning'

    // ALL COMPLETED
    if (completed === total) {
        const completedDate = new Date().toISOString()
        updateCollectionItemStatus(collectionId, 'COMPLETED', completedDate)
    }
    // ANY IN PROGRESS
    else if (inProgress > 0) {
        updateCollectionItemStatus(collectionId, 'IN_PROGRESS', null)
    }
    // ALL PENDING
    else if (pending === total) {
        updateCollectionItemStatus(collectionId, 'PENDING', null)
    }
    // MIXED (fallback)
    else {
        updateCollectionItemStatus(collectionId, 'PENDING', null)
    }
}
