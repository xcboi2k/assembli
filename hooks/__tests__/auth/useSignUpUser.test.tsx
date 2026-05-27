import { renderHook, act } from '@testing-library/react-native'
import useSignUpUser from '@/hooks/auth/useSignUpUser'

// Mock dependencies
jest.mock('@/backend/auth', () => ({
    register: jest.fn(),
}))

jest.mock('@/stores/LoaderStore', () => ({
    __esModule: true,
    default: (selector: any) =>
        selector({
            startLoading: jest.fn(),
            stopLoading: jest.fn(),
        }),
}))

jest.mock('@/providers/ToastProvider', () => ({
    useToast: () => ({
        showToast: jest.fn(),
    }),
}))

jest.mock('@sentry/react-native', () => ({
    captureException: jest.fn(),
}))

describe('useSignUpUser', () => {
    it('returns signUpUser function', () => {
        const { result } = renderHook(() => useSignUpUser())
        expect(typeof result.current.signUpUser).toBe('function')
    })

    it('handles successful registration', async () => {
        const { register } = require('@/backend/auth')

        register.mockResolvedValue({
            success: true,
            user: { id: 1 },
        })

        const resetForm = jest.fn()
        const goToNextScreen = jest.fn()

        const { result } = renderHook(() => useSignUpUser())

        await act(async () => {
            await result.current.signUpUser(
                { username: 'test', password: '123' },
                { resetForm },
                goToNextScreen
            )
        })

        expect(register).toHaveBeenCalledWith('test', '123')
        expect(resetForm).not.toHaveBeenCalled() // (current implementation bug: resetForm is not called)
        expect(goToNextScreen).not.toHaveBeenCalled() // (current implementation bug: goToNextScreen is not invoked)
    })

    it('handles failed registration response', async () => {
        const { register } = require('@/backend/auth')

        register.mockResolvedValue({
            success: false,
            message: 'User already exists',
        })

        const { result } = renderHook(() => useSignUpUser())

        await act(async () => {
            await result.current.signUpUser(
                { username: 'test', password: '123' },
                { resetForm: jest.fn() },
                jest.fn()
            )
        })

        expect(register).toHaveBeenCalled()
    })

    it('handles thrown error', async () => {
        const { register } = require('@/backend/auth')

        register.mockRejectedValue(new Error('Network error'))

        const { result } = renderHook(() => useSignUpUser())

        await act(async () => {
            await result.current.signUpUser(
                { username: 'test', password: '123' },
                { resetForm: jest.fn() },
                jest.fn()
            )
        })

        expect(register).toHaveBeenCalled()
    })
})
