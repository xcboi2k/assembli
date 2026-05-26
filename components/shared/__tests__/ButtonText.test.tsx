import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import ButtonText from '@/components/shared/ButtonText'

describe('ButtonText', () => {
    it('renders title correctly', () => {
        const { getByText } = render(
            <ButtonText title="Submit" onPress={jest.fn()} />
        )

        expect(getByText('Submit')).toBeTruthy()
    })

    it('calls onPress when pressed', () => {
        const onPress = jest.fn()

        const { getByText } = render(
            <ButtonText title="Click Me" onPress={onPress} />
        )

        fireEvent.press(getByText('Click Me'))

        expect(onPress).toHaveBeenCalledTimes(1)
    })

    it('does not call onPress when disabled', () => {
        const onPress = jest.fn()

        const { getByText } = render(
            <ButtonText title="Disabled" onPress={onPress} disabled />
        )

        fireEvent.press(getByText('Disabled'))

        expect(onPress).not.toHaveBeenCalled()
    })

    it('applies disabled styles via prop (smoke test)', () => {
        const { getByText } = render(
            <ButtonText title="Disabled" onPress={jest.fn()} disabled />
        )

        const text = getByText('Disabled')

        // ensures it renders without crashing in disabled state
        expect(text).toBeTruthy()
    })

    it('supports accessibilityLabel', () => {
        const { getByA11yLabel } = render(
            <ButtonText
                title="Save"
                onPress={jest.fn()}
                accessibilityLabel="save-button"
            />
        )

        expect(getByA11yLabel('save-button')).toBeTruthy()
    })

    it('renders bold variant correctly', () => {
        const { getByText } = render(
            <ButtonText title="Bold" onPress={jest.fn()} isBold />
        )

        expect(getByText('Bold')).toBeTruthy()
    })
})
