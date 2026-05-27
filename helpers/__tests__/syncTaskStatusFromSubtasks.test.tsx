import { syncTaskStatusFromSubtasks } from '../syncTaskStatusFromSubtasks'
import useUpdateTask from '@/hooks/main/tasks/useUpdateTask'

const mockUpdateTaskStatusRecord = jest.fn()

jest.mock('@/hooks/main/tasks/useUpdateTask', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        updateTaskStatusRecord: mockUpdateTaskStatusRecord,
    })),
}))

describe('syncTaskStatusFromSubtasks', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('sets task status to COMPLETED when all subtasks are completed', async () => {
        const task = {
            id: 1,
            subtasks: [{ status: 'COMPLETED' }, { status: 'COMPLETED' }],
        }

        await syncTaskStatusFromSubtasks(task, 100)

        expect(mockUpdateTaskStatusRecord).toHaveBeenCalledWith(
            1,
            100,
            'COMPLETED',
            expect.any(String)
        )
    })

    it('sets task status to IN_PROGRESS when any subtask is in progress', async () => {
        const task = {
            id: 1,
            subtasks: [{ status: 'IN_PROGRESS' }, { status: 'PENDING' }],
        }

        await syncTaskStatusFromSubtasks(task, 100)

        expect(mockUpdateTaskStatusRecord).toHaveBeenCalledWith(
            1,
            100,
            'IN_PROGRESS',
            null
        )
    })

    it('sets task status to PENDING when all subtasks are pending', async () => {
        const task = {
            id: 1,
            subtasks: [{ status: 'PENDING' }, { status: 'PENDING' }],
        }

        await syncTaskStatusFromSubtasks(task, 100)

        expect(mockUpdateTaskStatusRecord).toHaveBeenCalledWith(
            1,
            100,
            'PENDING',
            null
        )
    })

    it('falls back to PENDING for mixed statuses without IN_PROGRESS', async () => {
        const task = {
            id: 1,
            subtasks: [{ status: 'COMPLETED' }, { status: 'PENDING' }],
        }

        await syncTaskStatusFromSubtasks(task, 100)

        expect(mockUpdateTaskStatusRecord).toHaveBeenCalledWith(
            1,
            100,
            'PENDING',
            null
        )
    })

    it('handles empty subtasks array as COMPLETED (current logic)', async () => {
        const task = {
            id: 1,
            subtasks: [],
        }

        await syncTaskStatusFromSubtasks(task, 100)

        expect(mockUpdateTaskStatusRecord).toHaveBeenCalledWith(
            1,
            100,
            'COMPLETED',
            expect.any(String)
        )
    })

    it('handles undefined subtasks as COMPLETED (current logic)', async () => {
        const task = {
            id: 1,
        }

        await syncTaskStatusFromSubtasks(task, 100)

        expect(mockUpdateTaskStatusRecord).toHaveBeenCalledWith(
            1,
            100,
            'COMPLETED',
            expect.any(String)
        )
    })

    it('calls updateTaskStatusRecord with correct task id and collection id', async () => {
        const task = {
            id: 55,
            subtasks: [{ status: 'PENDING' }],
        }

        await syncTaskStatusFromSubtasks(task, 999)

        expect(mockUpdateTaskStatusRecord).toHaveBeenCalledWith(
            55,
            999,
            'PENDING',
            null
        )
    })
})
