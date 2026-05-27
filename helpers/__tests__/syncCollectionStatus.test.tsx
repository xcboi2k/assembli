import { syncCollectionStatus } from '../syncCollectionStatus'
import { getTasksByCollectionId } from '@/backend/collections/tasks'
import useUpdateCollectionItem from '@/hooks/main/collections/useUpdateCollectionItem'

jest.mock('@/backend/collections/tasks', () => ({
    getTasksByCollectionId: jest.fn(),
}))

const mockUpdateCollectionItemStatus = jest.fn()

jest.mock('@/hooks/main/collections/useUpdateCollectionItem', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        updateCollectionItemStatus: mockUpdateCollectionItemStatus,
    })),
}))

describe('syncCollectionStatus', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('sets collection to COMPLETED when all tasks are completed', async () => {
        ;(getTasksByCollectionId as jest.Mock).mockResolvedValue([
            { status: 'COMPLETED' },
            { status: 'COMPLETED' },
        ])

        await syncCollectionStatus(1)

        expect(mockUpdateCollectionItemStatus).toHaveBeenCalledWith(
            1,
            'COMPLETED',
            expect.any(String)
        )
    })

    it('sets collection to IN_PROGRESS when at least one task is in progress', async () => {
        ;(getTasksByCollectionId as jest.Mock).mockResolvedValue([
            { status: 'IN_PROGRESS' },
            { status: 'PENDING' },
        ])

        await syncCollectionStatus(1)

        expect(mockUpdateCollectionItemStatus).toHaveBeenCalledWith(
            1,
            'IN_PROGRESS',
            null
        )
    })

    it('sets collection to PENDING when all tasks are pending', async () => {
        ;(getTasksByCollectionId as jest.Mock).mockResolvedValue([
            { status: 'PENDING' },
            { status: 'PENDING' },
        ])

        await syncCollectionStatus(1)

        expect(mockUpdateCollectionItemStatus).toHaveBeenCalledWith(
            1,
            'PENDING',
            null
        )
    })

    it('falls back to PENDING for mixed statuses without IN_PROGRESS', async () => {
        ;(getTasksByCollectionId as jest.Mock).mockResolvedValue([
            { status: 'COMPLETED' },
            { status: 'PENDING' },
        ])

        await syncCollectionStatus(1)

        expect(mockUpdateCollectionItemStatus).toHaveBeenCalledWith(
            1,
            'PENDING',
            null
        )
    })

    it('handles empty task list as COMPLETED (current logic)', async () => {
        ;(getTasksByCollectionId as jest.Mock).mockResolvedValue([])

        await syncCollectionStatus(1)

        expect(mockUpdateCollectionItemStatus).toHaveBeenCalledWith(
            1,
            'COMPLETED',
            expect.any(String)
        )
    })

    it('calls getTasksByCollectionId with correct collectionId', async () => {
        ;(getTasksByCollectionId as jest.Mock).mockResolvedValue([])

        await syncCollectionStatus(999)

        expect(getTasksByCollectionId).toHaveBeenCalledWith(999)
    })
})
