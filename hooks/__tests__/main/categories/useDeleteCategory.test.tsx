import { renderHook, act } from '@testing-library/react-native'
import useDeleteCategory from '@/hooks/main/categories/useDeleteCategory'
import { deleteCategory as deleteCategoryRecord } from '@/backend/categories/categories'
import * as Sentry from '@sentry/react-native'

// mocks
jest.mock('@/backend/categories/categories', () => ({
    deleteCategory: jest.fn(),
}))

const startLoading = jest.fn()
const stopLoading = jest.fn()
const showToast = jest.fn()
const goToNextScreen = jest.fn()

jest.mock('@/stores/UserStore', () => ({
    __esModule: true,
    default: (selector: any) =>
        selector({
            user: { username: 'test-user' },
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

describe('useDeleteCategory', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('successfully deletes category', async () => {
        ;(deleteCategoryRecord as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Deleted successfully',
        })

        const { result } = renderHook(() => useDeleteCategory())

        let response: any

        await act(async () => {
            response = await result.current.deleteCategory(1, goToNextScreen)
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
        ;(deleteCategoryRecord as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Delete failed',
        })

        const { result } = renderHook(() => useDeleteCategory())

        let response: any

        await act(async () => {
            response = await result.current.deleteCategory(1, goToNextScreen)
        })

        expect(stopLoading).toHaveBeenCalled()
        expect(showToast).toHaveBeenCalledWith('Delete failed', 'error')
        expect(Sentry.captureException).toHaveBeenCalled()
        expect(response).toEqual({
            success: false,
            message: 'Delete failed',
        })
    })

    it('handles thrown error', async () => {
        ;(deleteCategoryRecord as jest.Mock).mockRejectedValue(
            new Error('Network error')
        )

        const { result } = renderHook(() => useDeleteCategory())

        let response: any

        await act(async () => {
            response = await result.current.deleteCategory(1, goToNextScreen)
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
