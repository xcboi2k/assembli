import * as Sentry from '@sentry/react-native'

import UserStore from '@/stores/UserStore'
import LoaderStore from '@/stores/LoaderStore'
import { useToast } from '@/providers/ToastProvider'
import {
    updateSubtaskName,
    updateSubtaskStatus,
} from '@/backend/collections/subtasks'
import { syncTaskStatusFromSubtasks } from '@/helpers/syncTaskStatusFromSubtasks'
import useUpdateTask from '../tasks/useUpdateTask'
import { syncCollectionStatus } from '@/helpers/syncCollectionStatus'

export default function useUpdateSubtask() {
    const user = UserStore((state) => state.user)
    const startLoading = LoaderStore((state) => state.startLoading)
    const stopLoading = LoaderStore((state) => state.stopLoading)

    const { showToast } = useToast()

    const updateSubtaskNameRecord = async (
        id,
        taskId,
        name,
        goToNextScreen
    ) => {
        startLoading()
        try {
            const response = await updateSubtaskName(
                Number(user.user_id),
                Number(taskId),
                Number(id),
                name
            )

            if (!response.success) {
                stopLoading()
                showToast(response.message, 'error')
                Sentry.captureException(
                    `Failed to update subtask name for ${user?.username ?? 'unknown'}. ${response.message}`
                )
            } else {
                stopLoading()
                showToast(response.message, 'success')
                goToNextScreen()
            }
        } catch (error) {
            stopLoading()
            await new Promise((resolve) => setTimeout(resolve, 100))
            showToast(`Service not available right now.`, 'error')
            Sentry.captureException(
                `Failed to update subtask name for ${user?.username ?? 'unknown'}. Service not available right now. ${error}`
            )
        }
    }

    const updateSubtaskStatusRecord = async (
        collectionId,
        taskId,
        id,
        task,
        status,
        goToNextScreen
    ) => {
        startLoading()
        try {
            const response = await updateSubtaskStatus(
                Number(user.user_id),
                Number(taskId),
                Number(id),
                status
            )

            if (!response.success) {
                stopLoading()
                showToast(response.message, 'error')
                Sentry.captureException(
                    `Failed to update subtask status for ${user?.username ?? 'unknown'}. ${response.message}`
                )
            } else {
                stopLoading()
                showToast(response.message, 'success')
                await syncTaskStatusFromSubtasks(task, collectionId)
                await syncCollectionStatus(collectionId)
                goToNextScreen()
            }
        } catch (error) {
            stopLoading()
            await new Promise((resolve) => setTimeout(resolve, 100))
            showToast(`Service not available right now.`, 'error')
            Sentry.captureException(
                `Failed to update subtask status for ${user?.username ?? 'unknown'}. Service not available right now. ${error}`
            )
        }
    }

    return { updateSubtaskNameRecord, updateSubtaskStatusRecord }
}
