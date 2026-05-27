import { renderHook, act } from '@testing-library/react-native'
import useAddTaskWithSubtasks from '@/hooks/main/useAddTasksWithSubTasks'

// Mock stores
jest.mock('@/stores/UserStore', () => ({
    __esModule: true,
    default: (selector: any) =>
        selector({
            user: { username: 'testUser' },
        }),
}))

jest.mock('@/stores/LoaderStore', () => ({
    __esModule: true,
    default: (selector: any) =>
        selector({
            startLoading: jest.fn(),
            stopLoading: jest.fn(),
        }),
}))

// Mock toast
jest.mock('@/providers/ToastProvider', () => ({
    useToast: () => ({
        showToast: jest.fn(),
    }),
}))

// Mock backend
jest.mock('@/backend/collections/tasks', () => ({
    createTask: jest.fn(),
}))

jest.mock('@/backend/collections/subtasks', () => ({
    createSubtask: jest.fn(),
}))

// Mock sentry
jest.mock('@sentry/react-native', () => ({
    captureException: jest.fn(),
}))

describe('useAddTaskWithSubtasks', () => {
    const { createTask } = require('@/backend/collections/tasks')
    const { createSubtask } = require('@/backend/collections/subtasks')

    it('returns addTasksWithSubtasks function', () => {
        const { result } = renderHook(() => useAddTaskWithSubtasks())
        expect(typeof result.current.addTasksWithSubtasks).toBe('function')
    })

    it('successfully creates tasks and subtasks', async () => {
        createTask.mockResolvedValue({
            success: true,
            data: { id: 1 },
        })

        createSubtask.mockResolvedValue({
            success: true,
            data: { id: 10 },
        })

        const goToNextScreen = jest.fn()

        const payload = {
            collection_id: 123,
            tasks: [
                {
                    title: 'Task 1',
                    subtasks: [{ title: 'Sub 1' }, { title: 'Sub 2' }],
                },
            ],
        }

        const { result } = renderHook(() => useAddTaskWithSubtasks())

        await act(async () => {
            await result.current.addTasksWithSubtasks(payload, goToNextScreen)
        })

        expect(createTask).toHaveBeenCalledWith({
            collection_id: 123,
            name: 'Task 1',
            status: 'PENDING',
        })

        expect(createSubtask).toHaveBeenCalledTimes(2)
        expect(goToNextScreen).toHaveBeenCalled()
    })

    it('handles task creation failure', async () => {
        createTask.mockResolvedValue({
            success: false,
            message: 'Task failed',
        })

        const payload = {
            collection_id: 123,
            tasks: [
                {
                    title: 'Task 1',
                    subtasks: [],
                },
            ],
        }

        const { result } = renderHook(() => useAddTaskWithSubtasks())

        await act(async () => {
            await result.current.addTasksWithSubtasks(payload, jest.fn())
        })

        expect(createTask).toHaveBeenCalled()
    })

    it('handles subtask creation failure', async () => {
        createTask.mockResolvedValue({
            success: true,
            data: { id: 1 },
        })

        createSubtask.mockResolvedValue({
            success: false,
            message: 'Subtask failed',
        })

        const payload = {
            collection_id: 123,
            tasks: [
                {
                    title: 'Task 1',
                    subtasks: [{ title: 'Sub 1' }],
                },
            ],
        }

        const { result } = renderHook(() => useAddTaskWithSubtasks())

        await act(async () => {
            await result.current.addTasksWithSubtasks(payload, jest.fn())
        })

        expect(createSubtask).toHaveBeenCalled()
    })
})
