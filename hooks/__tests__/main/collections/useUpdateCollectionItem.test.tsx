import { renderHook, act } from '@testing-library/react-native'
import useUpdateCollectionItem from '@/hooks/main/collections/useUpdateCollectionItem'
import {
    updateCollection,
    updateCollectionStatus,
} from '@/backend/collections/collections'
import * as Sentry from '@sentry/react-native'

// mocks
jest.mock('@/backend/collections/collections', () => ({
    updateCollection: jest.fn(),
    updateCollectionStatus: jest.fn(),
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

describe('useUpdateCollectionItem', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    // -------------------------
    // UPDATE COLLECTION ITEM
    // -------------------------
    it('successfully updates collection item', async () => {
        ;(updateCollection as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Updated',
        })

        const { result } = renderHook(() => useUpdateCollectionItem())

        await act(async () => {
            await result.current.updateCollectionItem(
                1,
                {
                    name: 'Updated name',
                    series: 'S1',
                    category: 2,
                    procurement_date: '2026-01-01',
                },
                resetForm,
                goToNextScreen
            )
        })

        expect(startLoading).toHaveBeenCalled()
        expect(stopLoading).toHaveBeenCalled()
        expect(showToast).toHaveBeenCalledWith('Updated', 'success')
        expect(resetForm).toHaveBeenCalled()
        expect(goToNextScreen).toHaveBeenCalled()
    })

    it('handles updateCollection failure response', async () => {
        ;(updateCollection as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Update failed',
        })

        const { result } = renderHook(() => useUpdateCollectionItem())

        await act(async () => {
            await result.current.updateCollectionItem(
                1,
                {
                    name: 'Updated name',
                },
                resetForm,
                goToNextScreen
            )
        })

        expect(stopLoading).toHaveBeenCalled()
        expect(showToast).toHaveBeenCalledWith('Update failed', 'error')
        expect(Sentry.captureException).toHaveBeenCalled()
        expect(goToNextScreen).not.toHaveBeenCalled()
    })

    it('handles updateCollection thrown error', async () => {
        ;(updateCollection as jest.Mock).mockRejectedValue(
            new Error('Network error')
        )

        const { result } = renderHook(() => useUpdateCollectionItem())

        await act(async () => {
            await result.current.updateCollectionItem(
                1,
                {
                    name: 'Updated name',
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

    // -------------------------
    // UPDATE COLLECTION STATUS
    // -------------------------
    it('successfully updates collection status (no crash)', async () => {
        ;(updateCollectionStatus as jest.Mock).mockResolvedValue({
            success: true,
        })

        const { result } = renderHook(() => useUpdateCollectionItem())

        await act(async () => {
            await result.current.updateCollectionItemStatus(
                1,
                'COMPLETED',
                '2026-01-01'
            )
        })

        expect(updateCollectionStatus).toHaveBeenCalledWith(
            1,
            1,
            'COMPLETED',
            '2026-01-01'
        )
    })

    it('captures error when status update fails', async () => {
        ;(updateCollectionStatus as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Status update failed',
        })

        const { result } = renderHook(() => useUpdateCollectionItem())

        await act(async () => {
            await result.current.updateCollectionItemStatus(
                1,
                'COMPLETED',
                null
            )
        })

        expect(Sentry.captureException).toHaveBeenCalled()
    })

    it('captures thrown error in status update', async () => {
        ;(updateCollectionStatus as jest.Mock).mockRejectedValue(
            new Error('Network error')
        )

        const { result } = renderHook(() => useUpdateCollectionItem())

        await act(async () => {
            await result.current.updateCollectionItemStatus(
                1,
                'COMPLETED',
                null
            )
        })

        expect(Sentry.captureException).toHaveBeenCalled()
    })
})
