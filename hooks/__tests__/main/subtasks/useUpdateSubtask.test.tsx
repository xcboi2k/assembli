import { renderHook, act } from '@testing-library/react-native'

import useUpdateSubtask from '@/hooks/main/subtasks/useUpdateSubtask'
import {
    updateSubtaskName,
    updateSubtaskStatus,
} from '@/backend/collections/subtasks'
import * as Sentry from '@sentry/react-native'

// ---------------- mocks ----------------
jest.mock('@/backend/collections/subtasks', () => ({
    updateSubtaskName: jest.fn(),
    updateSubtaskStatus: jest.fn(),
}))

jest.mock('@/stores/UserStore', () => ({
    __esModule: true,
    default: (selector: any) =>
        selector({
            user: {
                user_id: 1,
                username: 'testuser',
            },
        }),
}))

const startLoading = jest.fn()
const stopLoading = jest.fn()

jest.mock('@/stores/LoaderStore', () => ({
    __esModule: true,
    default: (selector: any) =>
        selector({
            startLoading,
            stopLoading,
        }),
}))

const showToast = jest.fn()

jest.mock('@/providers/ToastProvider', () => ({
    useToast: () => ({
        showToast,
    }),
}))

jest.mock('@/helpers/syncTaskStatusFromSubtasks', () => ({
    syncTaskStatusFromSubtasks: jest.fn(),
}))

jest.mock('@/helpers/syncCollectionStatus', () => ({
    syncCollectionStatus: jest.fn(),
}))

jest.mock('@sentry/react-native', () => ({
    captureException: jest.fn(),
}))

describe('useUpdateSubtask', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('updates subtask name successfully', async () => {
        ;(updateSubtaskName as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Updated name',
        })

        const goToNextScreen = jest.fn()

        const { result } = renderHook(() => useUpdateSubtask())

        await act(async () => {
            await result.current.updateSubtaskNameRecord(
                1,
                10,
                'New Name',
                goToNextScreen
            )
        })

        expect(startLoading).toHaveBeenCalled()
        expect(stopLoading).toHaveBeenCalled()
        expect(showToast).toHaveBeenCalledWith('Updated name', 'success')
        expect(goToNextScreen).toHaveBeenCalled()
    })

    it('handles update name failure', async () => {
        ;(updateSubtaskName as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Failed name update',
        })

        const goToNextScreen = jest.fn()

        const { result } = renderHook(() => useUpdateSubtask())

        await act(async () => {
            await result.current.updateSubtaskNameRecord(
                1,
                10,
                'New Name',
                goToNextScreen
            )
        })

        expect(showToast).toHaveBeenCalledWith('Failed name update', 'error')
        expect(Sentry.captureException).toHaveBeenCalled()
        expect(goToNextScreen).not.toHaveBeenCalled()
    })

    it('updates subtask status successfully and triggers sync', async () => {
        ;(updateSubtaskStatus as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Updated status',
        })

        const {
            syncTaskStatusFromSubtasks,
        } = require('@/helpers/syncTaskStatusFromSubtasks')

        const {
            syncCollectionStatus,
        } = require('@/helpers/syncCollectionStatus')

        const goToNextScreen = jest.fn()

        const { result } = renderHook(() => useUpdateSubtask())

        await act(async () => {
            await result.current.updateSubtaskStatusRecord(
                1,
                10,
                99,
                { id: 1 },
                'COMPLETED',
                goToNextScreen
            )
        })

        expect(showToast).toHaveBeenCalledWith('Updated status', 'success')
        expect(syncTaskStatusFromSubtasks).toHaveBeenCalled()
        expect(syncCollectionStatus).toHaveBeenCalled()
        expect(goToNextScreen).toHaveBeenCalled()
    })

    it('handles status update failure', async () => {
        ;(updateSubtaskStatus as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Failed status update',
        })

        const goToNextScreen = jest.fn()

        const { result } = renderHook(() => useUpdateSubtask())

        await act(async () => {
            await result.current.updateSubtaskStatusRecord(
                1,
                10,
                99,
                { id: 1 },
                'PENDING',
                goToNextScreen
            )
        })

        expect(showToast).toHaveBeenCalledWith('Failed status update', 'error')
        expect(goToNextScreen).not.toHaveBeenCalled()
        expect(Sentry.captureException).toHaveBeenCalled()
    })
})
