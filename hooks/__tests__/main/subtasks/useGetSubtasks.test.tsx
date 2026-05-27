import { renderHook, act } from '@testing-library/react-native'

import useGetSubtasks from '@/hooks/main/subtasks/useGetSubtasks'
import { getSubtasksByTaskId } from '@/backend/collections/subtasks'
import * as Sentry from '@sentry/react-native'

// -------------------- mocks --------------------
jest.mock('@/backend/collections/subtasks', () => ({
    getSubtasksByTaskId: jest.fn(),
}))

jest.mock('@/stores/UserStore', () => ({
    __esModule: true,
    default: (selector: any) =>
        selector({
            user: { id: 1, username: 'testuser' },
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

describe('useGetSubtasks', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('fetches subtasks successfully', async () => {
        ;(getSubtasksByTaskId as jest.Mock).mockResolvedValue({
            success: true,
            data: [{ id: 1, name: 'Subtask 1' }],
        })

        const { result } = renderHook(() => useGetSubtasks())

        await act(async () => {
            await result.current.getSubtasks(10)
        })

        expect(result.current.subtasks).toEqual([{ id: 1, name: 'Subtask 1' }])

        expect(result.current.loading).toBe(false)
        expect(showToast).not.toHaveBeenCalled()
    })

    it('handles API failure response', async () => {
        ;(getSubtasksByTaskId as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Failed request',
        })

        const { result } = renderHook(() => useGetSubtasks())

        await act(async () => {
            await result.current.getSubtasks(10)
        })

        expect(result.current.subtasks).toEqual([])
        expect(showToast).toHaveBeenCalledWith('Failed request', 'error')
        expect(Sentry.captureException).toHaveBeenCalled()
    })

    it('handles null data response', async () => {
        ;(getSubtasksByTaskId as jest.Mock).mockResolvedValue({
            success: true,
            data: null,
            message: 'No data',
        })

        const { result } = renderHook(() => useGetSubtasks())

        await act(async () => {
            await result.current.getSubtasks(10)
        })

        expect(result.current.subtasks).toEqual([])
        expect(showToast).toHaveBeenCalledWith('No data', 'error')
        expect(Sentry.captureException).toHaveBeenCalled()
    })

    it('handles thrown error', async () => {
        ;(getSubtasksByTaskId as jest.Mock).mockRejectedValue(
            new Error('Network error')
        )

        const { result } = renderHook(() => useGetSubtasks())

        await act(async () => {
            await result.current.getSubtasks(10)
        })

        expect(result.current.subtasks).toEqual([])
        expect(showToast).toHaveBeenCalledWith(
            'Service not available right now.',
            'error'
        )
        expect(Sentry.captureException).toHaveBeenCalled()
    })
})
