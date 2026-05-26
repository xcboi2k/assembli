import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import CategoriesScreen from '../../CategoriesScreen'

// ---------------- mocks ----------------
const mockNavigate = jest.fn()

const navigationMock = {
    navigate: mockNavigate,
}

jest.mock('@react-navigation/core', () => ({
    useFocusEffect: (cb: any) => cb(),
    useNavigation: () => navigationMock,
}))

const mockFetchCategories = jest.fn()
const mockDeleteCategory = jest.fn()

jest.mock('@/hooks/main/categories/useGetCategories', () => ({
    __esModule: true,
    default: () => ({
        categories: [
            { id: 1, name: 'GUNPLA' },
            { id: 2, name: 'LEGO' },
        ],
        loading: false,
        fetchCategories: mockFetchCategories,
    }),
}))

jest.mock('@/hooks/main/categories/useDeleteCategory', () => ({
    __esModule: true,
    default: () => ({
        deleteCategory: mockDeleteCategory,
    }),
}))

jest.mock('@/hooks/useRefresh', () => ({
    useRefresh: () => ({
        refreshing: false,
        onRefresh: jest.fn(),
    }),
}))

jest.mock('@/stores/LoaderStore', () => ({
    __esModule: true,
    default: (selector: any) =>
        selector({
            isLoading: false,
        }),
}))

// UI mocks
jest.mock('@/components/shared/Header', () => 'Header')
jest.mock('@/components/shared/CustomLoader', () => 'CustomLoader')
jest.mock('@/components/shared/categories/CategoryCard', () => {
    const React = require('react')
    const { Text, TouchableOpacity, View } = require('react-native')

    return ({ item, onEdit, onDelete }: any) => (
        <View>
            <Text>{item.name}</Text>

            <TouchableOpacity onPress={onEdit}>
                <Text>EDIT</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onDelete}>
                <Text>DELETE</Text>
            </TouchableOpacity>
        </View>
    )
})

jest.mock('@/components/shared/categories/CategorySummary', () => {
    const React = require('react')
    const { Text } = require('react-native')
    return () => <Text>CATEGORY_SUMMARY</Text>
})

// ---------------- test suite ----------------
describe('CategoriesScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders categories list', () => {
        const { getByText } = render(<CategoriesScreen />)

        expect(getByText('CATEGORY_SUMMARY')).toBeTruthy()
        expect(getByText('GUNPLA')).toBeTruthy()
        expect(getByText('LEGO')).toBeTruthy()
    })

    it('navigates to add category screen', () => {
        const { getByText } = render(<CategoriesScreen />)

        fireEvent.press(getByText('CATEGORY_SUMMARY'))

        expect(mockNavigate).toHaveBeenCalledWith('CategoriesAdd')
    })

    it('navigates to edit category screen', () => {
        const { getAllByText } = render(<CategoriesScreen />)

        fireEvent.press(getAllByText('EDIT')[0])

        expect(mockNavigate).toHaveBeenCalledWith(
            'CategoriesEdit',
            expect.objectContaining({
                id: 1,
            })
        )
    })

    it('deletes a category', async () => {
        const { getAllByText } = render(<CategoriesScreen />)

        fireEvent.press(getAllByText('DELETE')[0])

        await waitFor(() => {
            expect(mockDeleteCategory).toHaveBeenCalled()
        })
    })

    it('shows loader state', () => {
        jest.resetModules()

        jest.doMock('@/stores/LoaderStore', () => ({
            __esModule: true,
            default: () => ({
                isLoading: true,
            }),
        }))

        const { UNSAFE_getByType } = render(<CategoriesScreen />)

        expect(UNSAFE_getByType('CustomLoader')).toBeTruthy()
    })
})
