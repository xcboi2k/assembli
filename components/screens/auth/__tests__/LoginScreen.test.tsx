import { render, fireEvent } from '@testing-library/react-native'
import LoginScreen from '@/components/screens/auth/LoginScreen'

/**
 * MOCKS
 */
const mockLoginUser = jest.fn()
const mockNavigate = jest.fn()

/* useLoginUser hook */
jest.mock('@/hooks/auth/useLoginUser', () => ({
    __esModule: true,
    default: () => ({
        loginUser: mockLoginUser,
    }),
}))

/* navigation */
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
}))

/* loader store */
jest.mock('@/stores/LoaderStore', () => ({
    __esModule: true,
    default: (selector: any) =>
        selector({
            isLoading: false,
        }),
}))

/**
 * TEST SUITE
 */
describe('LoginScreen', () => {
    /**
     * -------------------------
     * RENDERING TESTS
     * -------------------------
     */
    describe('rendering', () => {
        it('renders main login UI text', () => {
            const { getByText, getByPlaceholderText } = render(<LoginScreen />)

            expect(getByText('SECURE_INTERFACE')).toBeOnTheScreen()
            expect(getByText('TERMINAL_LOGIN')).toBeOnTheScreen()

            expect(
                getByPlaceholderText('IDENTIFICATION_STRING')
            ).toBeOnTheScreen()

            expect(getByText('A U T H E N T I C A T E')).toBeOnTheScreen()
        })
    })

    /**
     * -------------------------
     * FORM BEHAVIOR TESTS
     * -------------------------
     */
    describe('form behavior', () => {
        it('updates inputs and submits form', () => {
            const { getByPlaceholderText, getByText } = render(<LoginScreen />)

            fireEvent.changeText(
                getByPlaceholderText('IDENTIFICATION_STRING'),
                'alexei'
            )

            fireEvent.changeText(getByPlaceholderText('••••••••••••'), '123456')

            fireEvent.press(getByText('A U T H E N T I C A T E'))

            expect(mockLoginUser).toHaveBeenCalled()
        })
    })

    /**
     * -------------------------
     * NAVIGATION TESTS
     * -------------------------
     */
    describe('navigation', () => {
        it('navigates to SignUp screen', () => {
            const { getByText } = render(<LoginScreen />)

            fireEvent.press(getByText('NEW_OPERATOR_REGISTRATION'))

            expect(mockNavigate).toHaveBeenCalledWith('SignUp')
        })
    })

    /**
     * -------------------------
     * LOADING STATE TESTS
     * -------------------------
     */
    describe('loading state', () => {
        it('shows loader when isLoading is true', () => {
            jest.doMock('@/stores/LoaderStore', () => ({
                __esModule: true,
                default: (selector: any) =>
                    selector({
                        isLoading: true,
                    }),
            }))

            const { UNSAFE_getByType } = render(<LoginScreen />)

            // CustomLoader should be visible
            expect(
                UNSAFE_getByType(
                    require('@/components/shared/CustomLoader').default
                )
            ).toBeTruthy()
        })
    })
})
