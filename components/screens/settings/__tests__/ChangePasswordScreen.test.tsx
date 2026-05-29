import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react-native'

import ChangePasswordScreen from '../ChangePasswordScreen'

/**
 * MOCKS
 */

const mockChangePassword = jest.fn()

jest.mock('@/hooks/settings/useChangePassword', () => ({
    useChangePassword: () => ({
        changePassword: mockChangePassword,
    }),
}))

jest.mock('@/stores/LoaderStore', () => ({
    __esModule: true,
    default: jest.fn(() => false),
}))

jest.mock('@/components/shared/Header', () => {
    return function MockHeader() {
        return null
    }
})

jest.mock('@/components/shared/CustomLoader', () => {
    return function MockCustomLoader() {
        return null
    }
})

jest.mock('@/components/shared/ButtonText', () => {
    const React = require('react')
    const { TouchableOpacity, Text } = require('react-native')

    return function MockButton({
        title,
        onPress,
        disabled,
    }: {
        title: string
        onPress: () => void
        disabled?: boolean
    }) {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled}
                testID="submit-button"
            >
                <Text>{title}</Text>
            </TouchableOpacity>
        )
    }
})

jest.mock('@/components/shared/FormTextInput', () => {
    const React = require('react')
    const { View, TextInput, Text } = require('react-native')

    return function MockFormTextInput({ label, inputProps, statusText }: any) {
        return (
            <View>
                <Text>{label}</Text>

                <TextInput
                    testID={label}
                    value={inputProps?.value}
                    onChangeText={inputProps?.onChangeText}
                    onBlur={inputProps?.onBlur}
                    placeholder={inputProps?.placeholder}
                />

                {statusText ? <Text>{statusText}</Text> : null}
            </View>
        )
    }
})

describe('ChangePasswordScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders all fields', () => {
        const { getByTestId } = render(<ChangePasswordScreen />)

        expect(getByTestId('OLD_PASSWORD')).toBeTruthy()
        expect(getByTestId('NEW_PASSWORD')).toBeTruthy()
        expect(getByTestId('CONFIRM_PASSWORD')).toBeTruthy()
    })

    it('shows validation errors on empty submit', async () => {
        const { getByTestId, getByText } = render(<ChangePasswordScreen />)

        fireEvent.press(getByTestId('submit-button'))

        await waitFor(() => {
            expect(getByText('Old password is required')).toBeTruthy()

            expect(getByText('New password is required')).toBeTruthy()

            expect(getByText('Please confirm your new password')).toBeTruthy()
        })
    })

    it('shows mismatch password validation', async () => {
        const { getByTestId, getByText } = render(<ChangePasswordScreen />)

        fireEvent.changeText(getByTestId('OLD_PASSWORD'), 'oldpassword')

        fireEvent.changeText(getByTestId('NEW_PASSWORD'), 'newpassword123')

        fireEvent.changeText(getByTestId('CONFIRM_PASSWORD'), 'wrongpassword')

        fireEvent.press(getByTestId('submit-button'))

        await waitFor(() => {
            expect(getByText('Passwords must match')).toBeTruthy()
        })
    })

    it('submits form successfully', async () => {
        mockChangePassword.mockResolvedValueOnce(true)

        const { getByTestId } = render(<ChangePasswordScreen />)

        fireEvent.changeText(getByTestId('OLD_PASSWORD'), 'oldpassword')

        fireEvent.changeText(getByTestId('NEW_PASSWORD'), 'newpassword123')

        fireEvent.changeText(getByTestId('CONFIRM_PASSWORD'), 'newpassword123')

        fireEvent.press(getByTestId('submit-button'))

        await waitFor(() => {
            expect(mockChangePassword).toHaveBeenCalledWith({
                oldPassword: 'oldpassword',
                newPassword: 'newpassword123',
                confirmPassword: 'newpassword123',
            })
        })
    })

    it('does not submit invalid form', async () => {
        const { getByTestId } = render(<ChangePasswordScreen />)

        fireEvent.changeText(getByTestId('OLD_PASSWORD'), '')

        fireEvent.changeText(getByTestId('NEW_PASSWORD'), '123')

        fireEvent.changeText(getByTestId('CONFIRM_PASSWORD'), '456')

        fireEvent.press(getByTestId('submit-button'))

        await waitFor(() => {
            expect(mockChangePassword).not.toHaveBeenCalled()
        })
    })
})
