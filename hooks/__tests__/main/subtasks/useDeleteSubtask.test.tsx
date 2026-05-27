import { renderHook, act } from '@testing-library/react-native'

import useDeleteSubtask from '@/hooks/main/subtasks/useDeleteSubtask'
import { deleteSubtask as deleteSubtaskRecord } from '@/backend/collections/subtasks'
import * as Sentry from '@sentry/react-native'

// -------------------- mocks --------------------
jest.mock('@/backend/collections/subtasks', () => ({
    deleteSubtask: jest.fn(),
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

jest.mock('@sentry/react-native', () => ({
    captureException: jest.fn(),
}))

describe('useDeleteSubtask', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('deletes subtask successfully', async () => {
        ;(deleteSubtaskRecord as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Deleted successfully',
        })

        const goToNextScreen = jest.fn()

        const { result } = renderHook(() => useDeleteSubtask())

        await act(async () => {
            await result.current.deleteSubtask(1, 10, goToNextScreen)
        })

        expect(startLoading).toHaveBeenCalled()
        expect(stopLoading).toHaveBeenCalled()
        expect(showToast).toHaveBeenCalledWith(
            'Deleted successfully',
            'success'
        )
        expect(goToNextScreen).toHaveBeenCalled()
    })

    it('handles API failure response', async () => {
        ;(deleteSubtaskRecord as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Failed to delete',
        })

        const goToNextScreen = jest.fn()

        const { result } = renderHook(() => useDeleteSubtask())

        await act(async () => {
            await result.current.deleteSubtask(1, 10, goToNextScreen)
        })

        expect(showToast).toHaveBeenCalledWith('Failed to delete', 'error')
        expect(Sentry.captureException).toHaveBeenCalled()
        expect(goToNextScreen).not.toHaveBeenCalled()
    })

    it('handles thrown error', async () => {
        ;(deleteSubtaskRecord as jest.Mock).mockRejectedValue(
            new Error('Network error')
        )

        const goToNextScreen = jest.fn()

        const { result } = renderHook(() => useDeleteSubtask())

        await act(async () => {
            await result.current.deleteSubtask(1, 10, goToNextScreen)
        })

        expect(showToast).toHaveBeenCalledWith(
            'Service not available right now.',
            'error'
        )
        expect(Sentry.captureException).toHaveBeenCalled()
        expect(goToNextScreen).not.toHaveBeenCalled()
    })
})
