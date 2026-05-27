import { renderHook, act } from '@testing-library/react-native'
import useAddCategory from '@/hooks/main/categories/useAddCategory'
import { createCategory } from '@/backend/categories/categories'
import * as Sentry from '@sentry/react-native'

// mocks
jest.mock('@/backend/categories/categories', () => ({
    createCategory: jest.fn(),
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

describe('useAddCategory', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('successfully creates category', async () => {
        ;(createCategory as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Created',
        })

        const { result } = renderHook(() => useAddCategory())

        await act(async () => {
            await result.current.addCategory(
                {
                    categoryName: 'Test',
                    categoryDescription: 'Desc',
                },
                resetForm,
                goToNextScreen
            )
        })

        expect(startLoading).toHaveBeenCalled()
        expect(stopLoading).toHaveBeenCalled()
        expect(showToast).toHaveBeenCalledWith('Created', 'success')
        expect(resetForm).toHaveBeenCalled()
        expect(goToNextScreen).toHaveBeenCalled()
    })

    it('handles API failure response', async () => {
        ;(createCategory as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Failed',
        })

        const { result } = renderHook(() => useAddCategory())

        await act(async () => {
            await result.current.addCategory(
                {
                    categoryName: 'Test',
                    categoryDescription: 'Desc',
                },
                resetForm,
                goToNextScreen
            )
        })

        expect(stopLoading).toHaveBeenCalled()
        expect(showToast).toHaveBeenCalledWith('Failed', 'error')
        expect(Sentry.captureException).toHaveBeenCalled()
    })

    it('handles thrown error', async () => {
        ;(createCategory as jest.Mock).mockRejectedValue(
            new Error('Network error')
        )

        const { result } = renderHook(() => useAddCategory())

        await act(async () => {
            await result.current.addCategory(
                {
                    categoryName: 'Test',
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
