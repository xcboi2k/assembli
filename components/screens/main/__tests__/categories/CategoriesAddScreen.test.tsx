import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import CategoriesAddScreen from '../../CategoriesAddScreen'

// ---------------- mocks ----------------
const mockNavigate = jest.fn()

const navigationMock = {
    navigate: mockNavigate,
}

jest.mock('@/stores/LoaderStore', () => ({
    __esModule: true,
    default: (selector: any) =>
        selector({
            isLoading: false,
        }),
}))

jest.mock('@/hooks/main/categories/useAddCategory', () => ({
    __esModule: true,
    default: () => ({
        addCategory: jest.fn(async (payload, resetForm, cb) => {
            resetForm?.()
            cb?.()
        }),
    }),
}))

jest.mock('@/components/shared/Header', () => 'Header')

jest.mock('@/components/shared/CustomLoader', () => 'CustomLoader')

jest.mock('@/components/shared/FormTextInput', () => {
    const React = require('react')
    const { TextInput, View } = require('react-native')

    return (props: any) => (
        <View>
            <TextInput testID={props.label} {...props.inputProps} />
        </View>
    )
})

jest.mock('@expo/vector-icons', () => ({
    Feather: () => null,
    MaterialIcons: () => null,
}))

// ---------------- test suite ----------------
describe('CategoriesAddScreen', () => {
    it('renders screen correctly', () => {
        const { getByText } = render(
            <CategoriesAddScreen navigation={navigationMock} />
        )

        expect(getByText('CATEGORY_CREATE')).toBeTruthy()
        expect(getByText('SYSTEM NOTE')).toBeTruthy()
    })

    it('updates category name input', () => {
        const { getByLabelText } = render(
            <CategoriesAddScreen navigation={navigationMock} />
        )

        const input = getByLabelText('CATEGORY NAME')

        fireEvent.changeText(input, 'MODEL KIT')

        expect(input.props.value).toBe('MODEL KIT')
    })

    it('submits form and navigates', async () => {
        const { getByText, getByLabelText } = render(
            <CategoriesAddScreen navigation={navigationMock} />
        )

        const nameInput = getByLabelText('CATEGORY NAME')

        fireEvent.changeText(nameInput, 'MODEL KIT')

        await waitFor(() => {
            fireEvent.press(getByText('COMMIT'))
        })

        expect(mockNavigate).toHaveBeenCalled()
    })

    it('aborts and navigates back', () => {
        const { getByText } = render(
            <CategoriesAddScreen navigation={navigationMock} />
        )

        fireEvent.press(getByText('ABORT'))

        expect(mockNavigate).toHaveBeenCalledWith('CategoriesHome')
    })
})
