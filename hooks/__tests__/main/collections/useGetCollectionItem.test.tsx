import { renderHook, act } from '@testing-library/react-native'

import useGetCollectionItem from '@/hooks/main/collections/useGetCollectionItem'
import { getCollectionById } from '@/backend/collections/collections'
import * as Sentry from '@sentry/react-native'

// ---- mocks ----
jest.mock('@/backend/collections/collections', () => ({
    getCollectionById: jest.fn(),
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

describe('useGetCollectionItem', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('fetches collection item successfully', async () => {
        ;(getCollectionById as jest.Mock).mockResolvedValue({
            success: true,
            data: { id: 1, name: 'Test Collection' },
        })

        const { result } = renderHook(() => useGetCollectionItem())

        await act(async () => {
            await result.current.getCollectionItem(1)
        })

        expect(result.current.data).toEqual({
            id: 1,
            name: 'Test Collection',
        })

        expect(result.current.loading).toBe(false)
        expect(showToast).not.toHaveBeenCalled()
    })

    it('handles API failure response', async () => {
        ;(getCollectionById as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Failed request',
        })

        const { result } = renderHook(() => useGetCollectionItem())

        await act(async () => {
            await result.current.getCollectionItem(1)
        })

        expect(result.current.data).toEqual([])
        expect(showToast).toHaveBeenCalledWith('Failed request', 'error')
        expect(Sentry.captureException).toHaveBeenCalled()
    })

    it('handles thrown error', async () => {
        ;(getCollectionById as jest.Mock).mockRejectedValue(
            new Error('Network error')
        )

        const { result } = renderHook(() => useGetCollectionItem())

        await act(async () => {
            await result.current.getCollectionItem(1)
        })

        expect(result.current.data).toEqual([])
        expect(showToast).toHaveBeenCalledWith(
            'Service not available right now.',
            'error'
        )
        expect(Sentry.captureException).toHaveBeenCalled()
    })
})
