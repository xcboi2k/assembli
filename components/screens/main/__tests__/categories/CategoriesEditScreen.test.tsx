import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import CategoriesEditScreen from '../../CategoriesEditScreen'

// ---------------- mocks ----------------
const mockNavigate = jest.fn()

const navigationMock = {
    navigate: mockNavigate,
}

const routeMock = {
    params: {
        id: 1,
        name: 'OLD NAME',
        description: 'OLD DESCRIPTION',
    },
}

jest.mock('@/stores/LoaderStore', () => ({
    __esModule: true,
    default: (selector: any) =>
        selector({
            isLoading: false,
        }),
}))

const mockUpdateCategory = jest.fn()

jest.mock('@/hooks/main/categories/useUpdateCategory', () => ({
    __esModule: true,
    default: () => ({
        updateCategory: mockUpdateCategory,
    }),
}))

jest.mock('@/components/shared/Header', () => 'Header')

jest.mock('@/components/shared/CustomLoader', () => 'CustomLoader')

jest.mock('@/components/shared/FormTextInput', () => {
    const React = require('react')
    const { TextInput, View } = require('react-native')

    return (props: any) => (
        <View>
            <TextInput {...props.inputProps} />
        </View>
    )
})

jest.mock('@expo/vector-icons', () => ({
    Feather: () => null,
    MaterialIcons: () => null,
}))

// ---------------- test suite ----------------
describe('CategoriesEditScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders pre-filled form values from route params', () => {
        const { getByDisplayValue } = render(
            <CategoriesEditScreen
                route={routeMock}
                navigation={navigationMock}
            />
        )

        expect(getByDisplayValue('OLD NAME')).toBeTruthy()
        expect(getByDisplayValue('OLD DESCRIPTION')).toBeTruthy()
    })

    it('updates category name input', () => {
        const { getByDisplayValue } = render(
            <CategoriesEditScreen
                route={routeMock}
                navigation={navigationMock}
            />
        )

        const input = getByDisplayValue('OLD NAME')

        fireEvent.changeText(input, 'NEW NAME')

        expect(input.props.value).toBe('NEW NAME')
    })

    it('submits updated category and navigates', async () => {
        const { getByText } = render(
            <CategoriesEditScreen
                route={routeMock}
                navigation={navigationMock}
            />
        )

        fireEvent.press(getByText('COMMIT'))

        await waitFor(() => {
            expect(mockUpdateCategory).toHaveBeenCalledWith(
                routeMock.params.id,
                {
                    categoryName: expect.any(String),
                    categoryDescription: expect.any(String),
                },
                expect.any(Function),
                expect.any(Function)
            )
        })
    })

    it('aborts navigation', () => {
        const { getByText } = render(
            <CategoriesEditScreen
                route={routeMock}
                navigation={navigationMock}
            />
        )

        fireEvent.press(getByText('ABORT'))

        expect(mockNavigate).toHaveBeenCalledWith('CategoriesHome')
    })
})
