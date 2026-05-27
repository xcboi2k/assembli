import { renderHook, act } from '@testing-library/react-native'

import useDeleteTask from '@/hooks/main/tasks/useDeleteTask'
import { deleteTask as deleteTaskRecord } from '@/backend/collections/tasks'
import * as Sentry from '@sentry/react-native'

// ---------------- mocks ----------------
jest.mock('@/backend/collections/tasks', () => ({
    deleteTask: jest.fn(),
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

describe('useDeleteTask', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('deletes task successfully', async () => {
        ;(deleteTaskRecord as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Task deleted',
        })

        const goToNextScreen = jest.fn()

        const { result } = renderHook(() => useDeleteTask())

        await act(async () => {
            await result.current.deleteTask(1, 10, goToNextScreen)
        })

        expect(startLoading).toHaveBeenCalled()
        expect(stopLoading).toHaveBeenCalled()
        expect(showToast).toHaveBeenCalledWith('Task deleted', 'success')
        expect(goToNextScreen).toHaveBeenCalled()
    })

    it('handles API failure response', async () => {
        ;(deleteTaskRecord as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Delete failed',
        })

        const goToNextScreen = jest.fn()

        const { result } = renderHook(() => useDeleteTask())

        await act(async () => {
            await result.current.deleteTask(1, 10, goToNextScreen)
        })

        expect(showToast).toHaveBeenCalledWith('Delete failed', 'error')
        expect(Sentry.captureException).toHaveBeenCalled()
        expect(goToNextScreen).not.toHaveBeenCalled()
    })

    it('handles thrown error', async () => {
        ;(deleteTaskRecord as jest.Mock).mockRejectedValue(
            new Error('Network error')
        )

        const goToNextScreen = jest.fn()

        const { result } = renderHook(() => useDeleteTask())

        await act(async () => {
            await result.current.deleteTask(1, 10, goToNextScreen)
        })

        expect(showToast).toHaveBeenCalledWith(
            'Service not available right now.',
            'error'
        )
        expect(Sentry.captureException).toHaveBeenCalled()
        expect(goToNextScreen).not.toHaveBeenCalled()
    })
})
