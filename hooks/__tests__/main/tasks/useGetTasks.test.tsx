import { renderHook, act } from '@testing-library/react-native'

import useGetTasks from '@/hooks/main/tasks/useGetTasks'
import { getTasksByCollectionId } from '@/backend/collections/tasks'
import * as Sentry from '@sentry/react-native'

// ---------------- mocks ----------------
jest.mock('@/backend/collections/tasks', () => ({
    getTasksByCollectionId: jest.fn(),
}))

jest.mock('@/stores/UserStore', () => ({
    __esModule: true,
    default: (selector: any) =>
        selector({
            user: {
                id: 1,
                username: 'testuser',
            },
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

describe('useGetTasks', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('fetches tasks successfully', async () => {
        ;(getTasksByCollectionId as jest.Mock).mockResolvedValue({
            success: true,
            data: [{ id: 1, name: 'Task 1' }],
        })

        const { result } = renderHook(() => useGetTasks())

        await act(async () => {
            await result.current.getTasks(10)
        })

        expect(result.current.tasks).toEqual([{ id: 1, name: 'Task 1' }])

        expect(result.current.loading).toBe(false)
        expect(showToast).not.toHaveBeenCalled()
    })

    it('handles API failure response', async () => {
        ;(getTasksByCollectionId as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Failed request',
        })

        const { result } = renderHook(() => useGetTasks())

        await act(async () => {
            await result.current.getTasks(10)
        })

        expect(result.current.tasks).toEqual([])
        expect(showToast).toHaveBeenCalledWith('Failed request', 'error')
        expect(Sentry.captureException).toHaveBeenCalled()
    })

    it('handles null data response', async () => {
        ;(getTasksByCollectionId as jest.Mock).mockResolvedValue({
            success: true,
            data: null,
            message: 'No data',
        })

        const { result } = renderHook(() => useGetTasks())

        await act(async () => {
            await result.current.getTasks(10)
        })

        expect(result.current.tasks).toEqual([])
        expect(showToast).toHaveBeenCalledWith('No data', 'error')
        expect(Sentry.captureException).toHaveBeenCalled()
    })

    it('handles thrown error', async () => {
        ;(getTasksByCollectionId as jest.Mock).mockRejectedValue(
            new Error('Network error')
        )

        const { result } = renderHook(() => useGetTasks())

        await act(async () => {
            await result.current.getTasks(10)
        })

        expect(result.current.tasks).toEqual([])
        expect(showToast).toHaveBeenCalledWith(
            'Service not available right now.',
            'error'
        )
        expect(Sentry.captureException).toHaveBeenCalled()
    })
})
