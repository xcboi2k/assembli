import { renderHook, act } from '@testing-library/react-native'
import useGetTasksWithSubtasks from '@/hooks/main/useGetTasksWithSubTasks'
// ---------------- mocks ----------------
jest.mock('@/stores/UserStore', () => ({
    __esModule: true,
    default: (selector: any) =>
        selector({
            user: { username: 'tester' },
        }),
}))

jest.mock('@/providers/ToastProvider', () => ({
    useToast: () => ({
        showToast: jest.fn(),
    }),
}))

jest.mock('@sentry/react-native', () => ({
    captureException: jest.fn(),
}))

jest.mock('@/backend/collections/tasks', () => ({
    getTasksByCollectionId: jest.fn(),
}))

jest.mock('@/backend/collections/subtasks', () => ({
    getSubtasksByTaskId: jest.fn(),
}))

describe('useGetTasksWithSubtasks', () => {
    const { getTasksByCollectionId } = require('@/backend/collections/tasks')
    const { getSubtasksByTaskId } = require('@/backend/collections/subtasks')

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('initial state is correct', () => {
        const { result } = renderHook(() => useGetTasksWithSubtasks())

        expect(result.current.loading).toBe(false)
        expect(result.current.tasks).toEqual([])
        expect(typeof result.current.getTasksWithSubtasks).toBe('function')
    })

    it('successfully fetches tasks and subtasks', async () => {
        getTasksByCollectionId.mockResolvedValue({
            success: true,
            data: [
                { id: 1, name: 'Task 1' },
                { id: 2, name: 'Task 2' },
            ],
        })

        getSubtasksByTaskId.mockResolvedValue({
            success: true,
            data: [{ id: 10, name: 'Subtask' }],
        })

        const { result } = renderHook(() => useGetTasksWithSubtasks())

        await act(async () => {
            await result.current.getTasksWithSubtasks(123)
        })

        expect(getTasksByCollectionId).toHaveBeenCalledWith(123)
        expect(getSubtasksByTaskId).toHaveBeenCalled()
        expect(result.current.tasks.length).toBe(2)
    })

    it('handles task fetch failure', async () => {
        getTasksByCollectionId.mockResolvedValue({
            success: false,
            message: 'Failed',
        })

        const { result } = renderHook(() => useGetTasksWithSubtasks())

        await act(async () => {
            await result.current.getTasksWithSubtasks(123)
        })

        expect(result.current.tasks).toEqual([])
    })

    it('handles exception error', async () => {
        getTasksByCollectionId.mockRejectedValue(new Error('Network error'))

        const { result } = renderHook(() => useGetTasksWithSubtasks())

        await act(async () => {
            await result.current.getTasksWithSubtasks(123)
        })

        expect(result.current.tasks).toEqual([])
    })
})
