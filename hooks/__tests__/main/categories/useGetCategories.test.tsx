import { renderHook, act } from '@testing-library/react-native'
import useGetCategories from '@/hooks/main/categories/useGetCategories'
import { getCategories } from '@/backend/categories/categories'
import * as Sentry from '@sentry/react-native'

// mocks
jest.mock('@/backend/categories/categories', () => ({
    getCategories: jest.fn(),
}))

const showToast = jest.fn()

jest.mock('@/stores/UserStore', () => ({
    __esModule: true,
    default: (selector: any) =>
        selector({
            user: { username: 'test-user' },
        }),
}))

jest.mock('@/providers/ToastProvider', () => ({
    useToast: () => ({ showToast }),
}))

jest.mock('@sentry/react-native', () => ({
    captureException: jest.fn(),
}))

describe('useGetCategories', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('fetches categories successfully', async () => {
        ;(getCategories as jest.Mock).mockResolvedValue({
            success: true,
            data: [{ id: 1, name: 'A' }],
        })

        const { result } = renderHook(() => useGetCategories())

        await act(async () => {
            await result.current.fetchCategories()
        })

        expect(result.current.categories).toEqual([{ id: 1, name: 'A' }])
        expect(result.current.loading).toBe(false)
    })

    it('handles API failure response', async () => {
        ;(getCategories as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Failed to load',
            data: [{ id: 1 }],
        })

        const { result } = renderHook(() => useGetCategories())

        await act(async () => {
            await result.current.fetchCategories()
        })

        expect(showToast).toHaveBeenCalledWith('Failed to load', 'error')
        expect(Sentry.captureException).toHaveBeenCalled()
        expect(result.current.categories).toEqual([{ id: 1 }])
        expect(result.current.loading).toBe(false)
    })

    it('handles thrown error', async () => {
        ;(getCategories as jest.Mock).mockRejectedValue(
            new Error('Network error')
        )

        const { result } = renderHook(() => useGetCategories())

        await act(async () => {
            await result.current.fetchCategories()
        })

        expect(showToast).toHaveBeenCalledWith(
            'Service not available right now.',
            'error'
        )
        expect(Sentry.captureException).toHaveBeenCalled()
        expect(result.current.categories).toEqual([])
        expect(result.current.loading).toBe(false)
    })
})
