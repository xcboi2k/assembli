import { renderHook, act } from '@testing-library/react-native'
import useLoginUser from '@/hooks/auth/useLoginUser'

// Mock dependencies
jest.mock('@/backend/auth', () => ({
    login: jest.fn(),
}))

jest.mock('@/stores/LoaderStore', () => ({
    __esModule: true,
    default: (selector: any) =>
        selector({
            startLoading: jest.fn(),
            stopLoading: jest.fn(),
        }),
}))

jest.mock('@/stores/UserStore', () => ({
    __esModule: true,
    default: (selector: any) =>
        selector({
            setLoggedIn: jest.fn(),
            setUser: jest.fn(),
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

describe('useLoginUser', () => {
    it('returns loginUser function', () => {
        const { result } = renderHook(() => useLoginUser())
        expect(typeof result.current.loginUser).toBe('function')
    })

    it('handles successful login', async () => {
        const { login } = require('@/backend/auth')

        login.mockResolvedValue({
            success: true,
            user: { id: 1, name: 'Test User' },
        })

        const { result } = renderHook(() => useLoginUser())

        await act(async () => {
            await result.current.loginUser(
                { username: 'test', password: '123' },
                { resetForm: jest.fn() }
            )
        })

        expect(login).toHaveBeenCalled()
    })

    it('handles failed login response', async () => {
        const { login } = require('@/backend/auth')

        login.mockResolvedValue({
            success: false,
            message: 'Invalid credentials',
        })

        const { result } = renderHook(() => useLoginUser())

        await act(async () => {
            await result.current.loginUser(
                { username: 'test', password: '123' },
                { resetForm: jest.fn() }
            )
        })

        expect(login).toHaveBeenCalled()
    })

    it('handles thrown error', async () => {
        const { login } = require('@/backend/auth')

        login.mockRejectedValue(new Error('Network error'))

        const { result } = renderHook(() => useLoginUser())

        await act(async () => {
            await result.current.loginUser(
                { username: 'test', password: '123' },
                { resetForm: jest.fn() }
            )
        })

        expect(login).toHaveBeenCalled()
    })
})
