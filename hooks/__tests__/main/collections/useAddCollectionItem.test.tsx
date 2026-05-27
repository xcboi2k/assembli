import { renderHook, act } from '@testing-library/react-native'
import useAddCollectionItem from '@/hooks/main/collections/useAddCollectionItem'
import { createCollection } from '@/backend/collections/collections'
import * as Sentry from '@sentry/react-native'

// mocks
jest.mock('@/backend/collections/collections', () => ({
    createCollection: jest.fn(),
}))

const startLoading = jest.fn()
const stopLoading = jest.fn()
const showToast = jest.fn()
const resetForm = jest.fn()

const navigation = {
    navigate: jest.fn(),
}

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

describe('useAddCollectionItem', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('successfully creates collection and navigates', async () => {
        ;(createCollection as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Created successfully',
            data: { id: 123 },
        })

        const { result } = renderHook(() => useAddCollectionItem())

        await act(async () => {
            await result.current.addCollectionItem(
                {
                    name: 'Item 1',
                    series: 'S1',
                    category: 2,
                    procurement_date: '2026-01-01',
                },
                resetForm,
                navigation
            )
        })

        expect(startLoading).toHaveBeenCalled()
        expect(stopLoading).toHaveBeenCalled()
        expect(resetForm).toHaveBeenCalled()

        expect(showToast).toHaveBeenCalledWith(
            'Created successfully',
            'success'
        )

        expect(navigation.navigate).toHaveBeenCalledWith('DashboardTaskAdd', {
            item: { id: 123 },
        })
    })

    it('handles API failure response', async () => {
        ;(createCollection as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Create failed',
        })

        const { result } = renderHook(() => useAddCollectionItem())

        await act(async () => {
            await result.current.addCollectionItem(
                {
                    name: 'Item 1',
                    series: 'S1',
                    category: 2,
                    procurement_date: '2026-01-01',
                },
                resetForm,
                navigation
            )
        })

        expect(stopLoading).toHaveBeenCalled()
        expect(showToast).toHaveBeenCalledWith('Create failed', 'error')
        expect(Sentry.captureException).toHaveBeenCalled()
        expect(navigation.navigate).not.toHaveBeenCalled()
    })

    it('handles thrown error', async () => {
        ;(createCollection as jest.Mock).mockRejectedValue(
            new Error('Network error')
        )

        const { result } = renderHook(() => useAddCollectionItem())

        await act(async () => {
            await result.current.addCollectionItem(
                {
                    name: 'Item 1',
                    series: 'S1',
                    category: 2,
                    procurement_date: '2026-01-01',
                },
                resetForm,
                navigation
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
