import { computeBuildProgress } from '../computeBuildProgress'

describe('computeBuildProgress', () => {
    it('returns 0 when tasks array is empty', () => {
        expect(computeBuildProgress([])).toBe(0)
    })

    it('computes progress using task status when no subtasks exist', () => {
        const tasks = [
            {
                status: 'COMPLETED',
            },
            {
                status: 'IN_PROGRESS',
            },
            {
                status: 'PENDING',
            },
        ]

        // (1 + 0.5 + 0) / 3 = 0.5
        expect(computeBuildProgress(tasks)).toBe(0.5)
    })

    it('computes progress using subtasks when subtasks exist', () => {
        const tasks = [
            {
                status: 'PENDING',
                subtasks: [
                    { status: 'COMPLETED' },
                    { status: 'IN_PROGRESS' },
                    { status: 'PENDING' },
                ],
            },
        ]

        // (1 + 0.5 + 0) / 3 = 0.5
        expect(computeBuildProgress(tasks)).toBe(0.5)
    })

    it('ignores parent task status if subtasks exist', () => {
        const tasks = [
            {
                status: 'COMPLETED',
                subtasks: [{ status: 'PENDING' }, { status: 'PENDING' }],
            },
        ]

        expect(computeBuildProgress(tasks)).toBe(0)
    })

    it('returns 1 when everything is completed', () => {
        const tasks = [
            {
                status: 'COMPLETED',
            },
            {
                subtasks: [{ status: 'COMPLETED' }, { status: 'COMPLETED' }],
            },
        ]

        expect(computeBuildProgress(tasks)).toBe(1)
    })

    it('returns 0 when everything is pending', () => {
        const tasks = [
            {
                status: 'PENDING',
            },
            {
                subtasks: [{ status: 'PENDING' }, { status: 'PENDING' }],
            },
        ]

        expect(computeBuildProgress(tasks)).toBe(0)
    })

    it('handles mixed task and subtask progress correctly', () => {
        const tasks = [
            {
                status: 'COMPLETED',
            },
            {
                status: 'IN_PROGRESS',
            },
            {
                subtasks: [{ status: 'COMPLETED' }, { status: 'PENDING' }],
            },
        ]

        // total units = 4
        // completed value = 1 + 0.5 + 1 + 0 = 2.5
        // 2.5 / 4 = 0.625 -> 0.63
        expect(computeBuildProgress(tasks)).toBe(0.63)
    })

    it('returns 0 if task has empty subtasks array and no valid status', () => {
        const tasks = [
            {
                subtasks: [],
                status: 'PENDING',
            },
        ]

        expect(computeBuildProgress(tasks)).toBe(0)
    })

    it('treats unknown statuses as 0', () => {
        const tasks = [
            {
                status: 'UNKNOWN',
            },
            {
                subtasks: [{ status: 'INVALID' }, { status: 'COMPLETED' }],
            },
        ]

        // (0 + 1) / 3 = 0.33
        expect(computeBuildProgress(tasks)).toBe(0.33)
    })
})
