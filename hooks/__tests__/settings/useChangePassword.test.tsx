import { renderHook, act } from '@testing-library/react-native'

import { useChangePassword } from '@/hooks/settings/useChangePassword'

import { changePassword } from '@/backend/auth'

/**
 * MOCKS
 */

const mockStartLoading = jest.fn()
const mockStopLoading = jest.fn()

const mockShowToast = jest.fn()

const mockSetLoggedOut = jest.fn()

jest.mock('@/backend/auth', () => ({
    changePassword: jest.fn(),
}))

jest.mock('@/stores/LoaderStore', () => ({
    __esModule: true,
    default: jest.fn((selector) =>
        selector({
            startLoading: mockStartLoading,
            stopLoading: mockStopLoading,
        })
    ),
}))

jest.mock('@/stores/UserStore', () => ({
    __esModule: true,
    default: jest.fn((selector) =>
        selector({
            user: {
                id: 1,
                username: 'testuser',
            },
            setLoggedOut: mockSetLoggedOut,
        })
    ),
}))

jest.mock('@/providers/ToastProvider', () => ({
    useToast: () => ({
        showToast: mockShowToast,
    }),
}))

jest.mock('@sentry/react-native', () => ({
    captureException: jest.fn(),
}))

describe('useChangePassword', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('changes password successfully', async () => {
        ;(changePassword as jest.Mock).mockResolvedValueOnce({
            success: true,
        })

        const { result } = renderHook(() => useChangePassword())

        await act(async () => {
            await result.current.changePassword({
                oldPassword: 'old123',
                newPassword: 'new123456',
            })
        })

        expect(mockStartLoading).toHaveBeenCalled()

        expect(changePassword).toHaveBeenCalledWith(1, 'old123', 'new123456')

        expect(mockShowToast).toHaveBeenCalledWith(
            'Successfully changed password',
            'success'
        )

        expect(mockSetLoggedOut).toHaveBeenCalled()

        expect(mockStopLoading).toHaveBeenCalled()
    })

    it('handles failed password change', async () => {
        ;(changePassword as jest.Mock).mockResolvedValueOnce({
            success: false,
            message: 'Invalid old password',
        })

        const { result } = renderHook(() => useChangePassword())

        await act(async () => {
            await result.current.changePassword({
                oldPassword: 'wrongpassword',
                newPassword: 'new123456',
            })
        })

        expect(mockStartLoading).toHaveBeenCalled()

        expect(mockShowToast).toHaveBeenCalledWith(
            'Invalid old password',
            'error'
        )

        expect(mockSetLoggedOut).not.toHaveBeenCalled()

        expect(mockStopLoading).toHaveBeenCalled()
    })

    it('handles service errors', async () => {
        ;(changePassword as jest.Mock).mockRejectedValueOnce(
            new Error('Network Error')
        )

        const { result } = renderHook(() => useChangePassword())

        await act(async () => {
            await result.current.changePassword({
                oldPassword: 'old123',
                newPassword: 'new123456',
            })
        })

        expect(mockStartLoading).toHaveBeenCalled()

        expect(mockShowToast).toHaveBeenCalledWith(
            'Service not available right now.',
            'error'
        )

        expect(mockSetLoggedOut).not.toHaveBeenCalled()

        expect(mockStopLoading).toHaveBeenCalled()
    })
})
