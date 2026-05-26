import { render, fireEvent } from '@testing-library/react-native'
import SignUpScreen from '@/components/screens/auth/SignUpScreen'

/**
 * MOCKS
 */
const mockSignUpUser = jest.fn()
const mockNavigate = jest.fn()

/* navigation */
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
}))

/* signup hook */
jest.mock('@/hooks/auth/useSignUpUser', () => ({
    __esModule: true,
    default: () => ({
        signUpUser: mockSignUpUser,
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
describe('SignUpScreen', () => {
    /**
     * -------------------------
     * RENDERING
     * -------------------------
     */
    it('renders sign up screen UI', () => {
        const { getByText, getByPlaceholderText } = render(<SignUpScreen />)

        expect(getByText('SYSTEM_AUTH')).toBeOnTheScreen()
        expect(getByText('OPERATOR_REGISTRATION')).toBeOnTheScreen()

        expect(getByPlaceholderText('Enter username')).toBeOnTheScreen()
        expect(getByPlaceholderText('Enter password')).toBeOnTheScreen()
    })

    /**
     * -------------------------
     * FORM BEHAVIOR
     * -------------------------
     */
    it('fills form and submits when checkbox is enabled', () => {
        const { getByText, getByPlaceholderText } = render(<SignUpScreen />)

        // fill username
        fireEvent.changeText(getByPlaceholderText('Enter username'), 'alexei')

        // fill password
        fireEvent.changeText(getByPlaceholderText('Enter password'), '123456')

        // NOTE: confirm password uses SAME placeholder in your code
        const inputs = getByPlaceholderText('Enter password')
        fireEvent.changeText(inputs, '123456')

        // enable checkbox (we target it by testID OR accessibility role ideally)
        const checkbox = getByText('AGREE_TO_SYSTEM_PROTOCOLS')
        fireEvent.press(checkbox)

        // submit
        fireEvent.press(getByText('REGISTER_OPERATOR'))

        expect(mockSignUpUser).toHaveBeenCalled()
    })

    /**
     * -------------------------
     * NAVIGATION
     * -------------------------
     */
    it('navigates to login screen', () => {
        const { getByText } = render(<SignUpScreen />)

        fireEvent.press(getByText('Log In'))

        expect(mockNavigate).toHaveBeenCalledWith('Login')
    })

    /**
     * -------------------------
     * BUTTON DISABLED STATE
     * -------------------------
     */
    it('disables register button when checkbox is unchecked', () => {
        const { getByText } = render(<SignUpScreen />)

        const button = getByText('REGISTER_OPERATOR').parent

        expect(button?.props?.disabled).toBe(true)
    })
})
