import { renderHook, act } from '@testing-library/react-native'
import useGetCollectionsTree from '@/hooks/main/useGetCollectionsTree'

// ------------------ mocks ------------------
jest.mock('@/stores/UserStore', () => ({
    __esModule: true,
    default: (selector: any) =>
        selector({
            user: { id: 1, username: 'tester' },
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

// backend mocks
jest.mock('@/backend/collections/collections', () => ({
    getCollectionsByUserId: jest.fn(),
    getCollectionById: jest.fn(),
}))

jest.mock('@/backend/collections/tasks', () => ({
    getTasksByCollectionId: jest.fn(),
}))

jest.mock('@/backend/collections/subtasks', () => ({
    getSubtasksByTaskId: jest.fn(),
}))

describe('useGetCollectionsTree', () => {
    const {
        getCollectionsByUserId,
        getCollectionById,
    } = require('@/backend/collections/collections')

    const { getTasksByCollectionId } = require('@/backend/collections/tasks')
    const { getSubtasksByTaskId } = require('@/backend/collections/subtasks')

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('initial state should be correct', () => {
        const { result } = renderHook(() => useGetCollectionsTree())

        expect(result.current.loading).toBe(false)
        expect(result.current.data).toEqual([])
        expect(result.current.analytics).toBe(null)
    })

    it('loads collections by user id successfully', async () => {
        getCollectionsByUserId.mockResolvedValue({
            success: true,
            data: [
                { id: 1, status: 'completed' },
                { id: 2, status: 'pending' },
            ],
        })

        getTasksByCollectionId.mockResolvedValue({
            success: true,
            data: [{ id: 10, status: 'completed' }],
        })

        getSubtasksByTaskId.mockResolvedValue({
            success: true,
            data: [{ id: 100, status: 'completed' }],
        })

        const { result } = renderHook(() => useGetCollectionsTree())

        await act(async () => {
            await result.current.getByUserId(1)
        })

        expect(getCollectionsByUserId).toHaveBeenCalledWith(1)
        expect(result.current.data.length).toBe(2)
        expect(result.current.analytics).not.toBeNull()
    })

    it('handles failed fetch by user id', async () => {
        getCollectionsByUserId.mockResolvedValue({
            success: false,
            message: 'Error fetching',
        })

        const { result } = renderHook(() => useGetCollectionsTree())

        await act(async () => {
            await result.current.getByUserId(1)
        })

        expect(result.current.data).toEqual([])
    })

    it('loads single collection tree', async () => {
        getCollectionById.mockResolvedValue({
            success: true,
            data: { id: 1 },
        })

        getTasksByCollectionId.mockResolvedValue({
            success: true,
            data: [{ id: 10, status: 'pending' }],
        })

        getSubtasksByTaskId.mockResolvedValue({
            success: true,
            data: [],
        })

        const { result } = renderHook(() => useGetCollectionsTree())

        await act(async () => {
            await result.current.getByCollectionId(1)
        })

        expect(getCollectionById).toHaveBeenCalledWith(1)
        expect(result.current.data.length).toBe(1)
    })

    it('handles exception errors', async () => {
        getCollectionsByUserId.mockRejectedValue(new Error('Network error'))

        const { result } = renderHook(() => useGetCollectionsTree())

        await act(async () => {
            await result.current.getByUserId(1)
        })

        expect(result.current.data).toEqual([])
    })
})
