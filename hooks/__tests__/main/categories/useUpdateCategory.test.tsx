import { renderHook, act } from '@testing-library/react-native'
import useUpdateCategory from '@/hooks/main/categories/useUpdateCategory'
import { updateCategory as updateCategoryRecord } from '@/backend/categories/categories'
import * as Sentry from '@sentry/react-native'

// mocks
jest.mock('@/backend/categories/categories', () => ({
    updateCategory: jest.fn(),
}))

const startLoading = jest.fn()
const stopLoading = jest.fn()
const showToast = jest.fn()
const resetForm = jest.fn()
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

describe('useUpdateCategory', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('updates category successfully', async () => {
        ;(updateCategoryRecord as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Updated successfully',
        })

        const { result } = renderHook(() => useUpdateCategory())

        await act(async () => {
            await result.current.updateCategory(
                1,
                {
                    categoryName: 'Updated',
                    categoryDescription: 'Desc',
                },
                resetForm,
                goToNextScreen
            )
        })

        expect(startLoading).toHaveBeenCalled()
        expect(stopLoading).toHaveBeenCalled()
        expect(showToast).toHaveBeenCalledWith(
            'Updated successfully',
            'success'
        )
        expect(resetForm).toHaveBeenCalled()
        expect(goToNextScreen).toHaveBeenCalled()
    })

    it('handles API failure response', async () => {
        ;(updateCategoryRecord as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Update failed',
        })

        const { result } = renderHook(() => useUpdateCategory())

        await act(async () => {
            await result.current.updateCategory(
                1,
                {
                    categoryName: 'Updated',
                    categoryDescription: 'Desc',
                },
                resetForm,
                goToNextScreen
            )
        })

        expect(stopLoading).toHaveBeenCalled()
        expect(showToast).toHaveBeenCalledWith('Update failed', 'error')
        expect(Sentry.captureException).toHaveBeenCalled()
    })

    it('handles thrown error', async () => {
        ;(updateCategoryRecord as jest.Mock).mockRejectedValue(
            new Error('Network error')
        )

        const { result } = renderHook(() => useUpdateCategory())

        await act(async () => {
            await result.current.updateCategory(
                1,
                {
                    categoryName: 'Updated',
                    categoryDescription: 'Desc',
                },
                resetForm,
                goToNextScreen
            )
        })

        expect(stopLoading).toHaveBeenCalled()
        expect(showToast).toHaveBeenCalledWith(
            'Service not available right now.',
            'error'
        )
        expect(Sentry.captureException).toHaveBeenCalled()
    })
})
