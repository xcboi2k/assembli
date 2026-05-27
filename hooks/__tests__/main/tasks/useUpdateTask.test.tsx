import { renderHook, act } from '@testing-library/react-native'

import useUpdateTask from '@/hooks/main/tasks/useUpdateTask'
import { updateTaskName, updateTaskStatus } from '@/backend/collections/tasks'
import * as Sentry from '@sentry/react-native'

// ---------------- mocks ----------------
jest.mock('@/backend/collections/tasks', () => ({
    updateTaskName: jest.fn(),
    updateTaskStatus: jest.fn(),
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

describe('useUpdateTask', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    // ---------------- NAME UPDATE ----------------
    it('updates task name successfully', async () => {
        ;(updateTaskName as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Updated name',
        })

        const goToNextScreen = jest.fn()

        const { result } = renderHook(() => useUpdateTask())

        await act(async () => {
            await result.current.updateTaskNameRecord(
                1,
                10,
                'New Task Name',
                goToNextScreen
            )
        })

        expect(startLoading).toHaveBeenCalled()
        expect(stopLoading).toHaveBeenCalled()
        expect(showToast).toHaveBeenCalledWith('Updated name', 'success')
        expect(goToNextScreen).toHaveBeenCalled()
    })

    it('handles task name update failure', async () => {
        ;(updateTaskName as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Failed update',
        })

        const goToNextScreen = jest.fn()

        const { result } = renderHook(() => useUpdateTask())

        await act(async () => {
            await result.current.updateTaskNameRecord(
                1,
                10,
                'New Task Name',
                goToNextScreen
            )
        })

        expect(showToast).toHaveBeenCalledWith('Failed update', 'error')
        expect(Sentry.captureException).toHaveBeenCalled()
        expect(goToNextScreen).not.toHaveBeenCalled()
    })

    // ---------------- STATUS UPDATE ----------------
    it('updates task status successfully', async () => {
        ;(updateTaskStatus as jest.Mock).mockResolvedValue({
            success: true,
        })

        const { result } = renderHook(() => useUpdateTask())

        await act(async () => {
            await result.current.updateTaskStatusRecord(
                1,
                10,
                'COMPLETED',
                '2026-01-01'
            )
        })

        expect(updateTaskStatus).toHaveBeenCalled()
        expect(Sentry.captureException).not.toHaveBeenCalled()
    })

    it('handles task status failure response', async () => {
        ;(updateTaskStatus as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Update failed',
        })

        const { result } = renderHook(() => useUpdateTask())

        await act(async () => {
            await result.current.updateTaskStatusRecord(
                1,
                10,
                'COMPLETED',
                '2026-01-01'
            )
        })

        expect(Sentry.captureException).toHaveBeenCalled()
    })

    it('handles thrown error in status update', async () => {
        ;(updateTaskStatus as jest.Mock).mockRejectedValue(
            new Error('Network error')
        )

        const { result } = renderHook(() => useUpdateTask())

        await act(async () => {
            await result.current.updateTaskStatusRecord(
                1,
                10,
                'COMPLETED',
                '2026-01-01'
            )
        })

        expect(Sentry.captureException).toHaveBeenCalled()
    })
})
