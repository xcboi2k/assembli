import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import CustomTextInput from '@/components/shared/CustomTextInput'

describe('CustomTextInput', () => {
    it('renders custom label', () => {
        const { getByText } = render(<CustomTextInput customLabel="Email" />)

        expect(getByText('Email')).toBeTruthy()
    })

    it('renders right label when provided', () => {
        const { getByText } = render(
            <CustomTextInput customLabel="Password" rightLabel="Forgot?" />
        )

        expect(getByText('Forgot?')).toBeTruthy()
    })

    it('renders TextInput', () => {
        const { getByPlaceholderText } = render(
            <CustomTextInput inputProps={{ placeholder: 'Enter text' }} />
        )

        expect(getByPlaceholderText('Enter text')).toBeTruthy()
    })

    it('renders status message when hasStatus is true', () => {
        const { getByText } = render(
            <CustomTextInput hasStatus statusText="Invalid input" />
        )

        expect(getByText('Invalid input')).toBeTruthy()
    })

    it('toggles password visibility icon (renders button)', () => {
        const { getByRole } = render(
            <CustomTextInput
                variant="password"
                inputProps={{ placeholder: 'Password' }}
            />
        )

        const button = getByRole('button')

        fireEvent.press(button)

        expect(button).toBeTruthy()
    })

    it('sets secureTextEntry when password variant is used', () => {
        const { getByPlaceholderText } = render(
            <CustomTextInput
                variant="password"
                inputProps={{ placeholder: 'Password' }}
            />
        )

        const input = getByPlaceholderText('Password')

        expect(input.props.secureTextEntry).toBe(true)
    })

    it('does not render password toggle for non-password variant', () => {
        const { queryByRole } = render(
            <CustomTextInput
                variant="email"
                inputProps={{ placeholder: 'Email' }}
            />
        )

        expect(queryByRole('button')).toBeNull()
    })
})
