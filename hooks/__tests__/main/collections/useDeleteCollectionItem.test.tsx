import { renderHook, act } from '@testing-library/react-native'
import useDeleteCollectionItem from '@/hooks/main/collections/useDeleteCollectionItem'
import { deleteCollection } from '@/backend/collections/collections'
import * as Sentry from '@sentry/react-native'

// mocks
jest.mock('@/backend/collections/collections', () => ({
    deleteCollection: jest.fn(),
}))

const startLoading = jest.fn()
const stopLoading = jest.fn()
const showToast = jest.fn()
const goToNextScreen = jest.fn()

jest.mock('@/stores/UserStore', () => ({
    __esModule: true,
    default: (selector: any) =>
        selector({
            user: { id: 1, username: 'test-user' },
        }),
}))

jest.mock('@/stores/LoaderStore', () => ({
    __esModule: true,
    default: (selector: any) =>
        selector({
            startLoading,
            stopLoading,
        }),
}))

jest.mock('@/providers/ToastProvider', () => ({
    useToast: () => ({ showToast }),
}))

jest.mock('@sentry/react-native', () => ({
    captureException: jest.fn(),
}))

describe('useDeleteCollectionItem', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('successfully deletes collection item', async () => {
        ;(deleteCollection as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Deleted successfully',
        })

        const { result } = renderHook(() => useDeleteCollectionItem())

        let response: any

        await act(async () => {
            response = await result.current.deleteCollectionItem(
                1,
                goToNextScreen
            )
        })

        expect(startLoading).toHaveBeenCalled()
        expect(stopLoading).toHaveBeenCalled()
        expect(showToast).toHaveBeenCalledWith(
            'Deleted successfully',
            'success'
        )
        expect(goToNextScreen).toHaveBeenCalled()
        expect(response).toEqual({
            success: true,
            message: 'Deleted successfully',
        })
    })

    it('handles API failure response', async () => {
        ;(deleteCollection as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Delete failed',
        })

        const { result } = renderHook(() => useDeleteCollectionItem())

        let response: any

        await act(async () => {
            response = await result.current.deleteCollectionItem(
                1,
                goToNextScreen
            )
        })

        expect(stopLoading).toHaveBeenCalled()
        expect(showToast).toHaveBeenCalledWith('Delete failed', 'error')
        expect(Sentry.captureException).toHaveBeenCalled()
        expect(goToNextScreen).not.toHaveBeenCalled()
        expect(response).toEqual({
            success: false,
            message: 'Delete failed',
        })
    })

    it('handles thrown error', async () => {
        ;(deleteCollection as jest.Mock).mockRejectedValue(
            new Error('Network error')
        )

        const { result } = renderHook(() => useDeleteCollectionItem())

        let response: any

        await act(async () => {
            response = await result.current.deleteCollectionItem(
                1,
                goToNextScreen
            )
        })

        expect(stopLoading).toHaveBeenCalled()
        expect(showToast).toHaveBeenCalledWith(
            'Service not available right now.',
            'error'
        )
        expect(Sentry.captureException).toHaveBeenCalled()
        expect(response).toBeNull()
    })
})
