import { renderHook, act } from '@testing-library/react-native'

import useGetCollectionItems from '@/hooks/main/collections/useGetCollectionItems'
import { getCollectionsByUserId } from '@/backend/collections/collections'
import * as Sentry from '@sentry/react-native'

// -------------------- mocks --------------------
jest.mock('@/backend/collections/collections', () => ({
    getCollectionsByUserId: jest.fn(),
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

describe('useGetCollectionItems', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('fetches collections successfully', async () => {
        ;(getCollectionsByUserId as jest.Mock).mockResolvedValue({
            success: true,
            data: [{ id: 1, name: 'Collection A' }],
        })

        const { result } = renderHook(() => useGetCollectionItems())

        await act(async () => {
            await result.current.getCollectionItems()
        })

        expect(result.current.data).toEqual([{ id: 1, name: 'Collection A' }])

        expect(result.current.loading).toBe(false)
        expect(showToast).not.toHaveBeenCalled()
    })

    it('handles API failure response', async () => {
        ;(getCollectionsByUserId as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Failed to fetch',
        })

        const { result } = renderHook(() => useGetCollectionItems())

        await act(async () => {
            await result.current.getCollectionItems()
        })

        expect(result.current.data).toEqual([])
        expect(showToast).toHaveBeenCalledWith('Failed to fetch', 'error')
        expect(Sentry.captureException).toHaveBeenCalled()
    })

    it('handles thrown error', async () => {
        ;(getCollectionsByUserId as jest.Mock).mockRejectedValue(
            new Error('Network error')
        )

        const { result } = renderHook(() => useGetCollectionItems())

        await act(async () => {
            await result.current.getCollectionItems()
        })

        expect(result.current.data).toEqual([])
        expect(showToast).toHaveBeenCalledWith(
            'Service not available right now.',
            'error'
        )
        expect(Sentry.captureException).toHaveBeenCalled()
    })
})
