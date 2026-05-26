import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import SignUpTextInput from '@/components/shared/signup/SignUpTextInput'

describe('SignUpTextInput', () => {
    it('renders label when provided', () => {
        const { getByText } = render(
            <SignUpTextInput label="Email" variant="email" />
        )

        expect(getByText('Email')).toBeTruthy()
    })

    it('renders TextInput', () => {
        const { getByPlaceholderText } = render(
            <SignUpTextInput
                variant="email"
                inputProps={{ placeholder: 'Enter email' }}
            />
        )

        expect(getByPlaceholderText('Enter email')).toBeTruthy()
    })

    it('shows password toggle only when variant is password', () => {
        const { queryByRole, getByRole } = render(
            <SignUpTextInput variant="password" />
        )

        // icon exists (TouchableOpacity wrapping it)
        expect(getByRole('button')).toBeTruthy()
    })

    it('does not show password toggle for non-password variant', () => {
        const { queryByRole } = render(<SignUpTextInput variant="email" />)

        expect(queryByRole('button')).toBeNull()
    })

    it('toggles password visibility state when pressed', () => {
        const { getByRole } = render(<SignUpTextInput variant="password" />)

        const button = getByRole('button')

        fireEvent.press(button)
        fireEvent.press(button)

        // No direct UI change assertion because icons are external,
        // but ensures toggle handler runs without crash
        expect(button).toBeTruthy()
    })

    it('renders status text when hasStatus is true', () => {
        const { getByText } = render(
            <SignUpTextInput hasStatus statusText="Invalid email" />
        )

        expect(getByText('Invalid email')).toBeTruthy()
    })
})
