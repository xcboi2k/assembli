import * as Sentry from '@sentry/react-native'

import UserStore from '@/stores/UserStore'
import LoaderStore from '@/stores/LoaderStore'
import { useToast } from '@/providers/ToastProvider'
import {
    updateSubtaskName,
    updateSubtask as updateSubtaskRecord,
    updateSubtaskStatus,
} from '@/backend/collections/subtasks'

export default function useUpdateSubtask() {
    const user = UserStore((state) => state.user)
    const startLoading = LoaderStore((state) => state.startLoading)
    const stopLoading = LoaderStore((state) => state.stopLoading)

    const { showToast } = useToast()

    const updateSubtaskNameRecord = async (
        id,
        values,
        resetForm,
        goToNextScreen
    ) => {
        startLoading()
        try {
            const response = await updateSubtaskName(Number(id), values.name)

            if (!response.success) {
                stopLoading()
                showToast(response.message, 'error')
                Sentry.captureException(
                    `Failed to update subtask name for ${user?.username ?? 'unknown'}. ${response.message}`
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
                `Failed to update subtask name for ${user?.username ?? 'unknown'}. Service not available right now. ${error}`
            )
        }
    }

    const updateSubtaskStatusRecord = async (
        id,
        status,
        resetForm,
        goToNextScreen
    ) => {
        startLoading()
        try {
            const response = await updateSubtaskStatus(Number(id), status)

            if (!response.success) {
                stopLoading()
                showToast(response.message, 'error')
                Sentry.captureException(
                    `Failed to update subtask status for ${user?.username ?? 'unknown'}. ${response.message}`
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
                `Failed to update subtask status for ${user?.username ?? 'unknown'}. Service not available right now. ${error}`
            )
        }
    }

    return { updateSubtaskNameRecord, updateSubtaskStatusRecord }
}
