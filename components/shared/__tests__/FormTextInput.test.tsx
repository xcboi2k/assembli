import React from 'react'
import { render } from '@testing-library/react-native'
import FormTextInput from '@/components/shared/FormTextInput'

describe('FormTextInput', () => {
    it('renders label when provided', () => {
        const { getByText } = render(
            <FormTextInput
                label="Username"
                inputProps={{ placeholder: 'Enter username' }}
            />
        )

        expect(getByText('Username')).toBeTruthy()
    })

    it('does not render label when not provided', () => {
        const { queryByText } = render(
            <FormTextInput inputProps={{ placeholder: 'No label' }} />
        )

        expect(queryByText('Username')).toBeNull()
    })

    it('renders TextInput with placeholder', () => {
        const { getByPlaceholderText } = render(
            <FormTextInput inputProps={{ placeholder: 'Type here' }} />
        )

        expect(getByPlaceholderText('Type here')).toBeTruthy()
    })

    it('renders multiline style when multiline is true', () => {
        const { getByPlaceholderText } = render(
            <FormTextInput
                multiline
                inputProps={{ placeholder: 'Multiline input' }}
            />
        )

        const input = getByPlaceholderText('Multiline input')

        expect(input.props.multiline).toBe(true)
    })

    it('renders status message when hasStatus is true', () => {
        const { getByText } = render(
            <FormTextInput
                hasStatus
                statusText="Error occurred"
                inputProps={{ placeholder: 'test' }}
            />
        )

        expect(getByText('Error occurred')).toBeTruthy()
    })

    it('does not render status message when hasStatus is false', () => {
        const { queryByText } = render(
            <FormTextInput
                hasStatus={false}
                statusText="Should not show"
                inputProps={{ placeholder: 'test' }}
            />
        )

        expect(queryByText('Should not show')).toBeNull()
    })
})
