import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import DashboardCollectionAddScreen from '../../dashboard/DashboardCollectionAddScreen'

/* ---------------------------
   MOCKS (critical for your screen)
---------------------------- */

// Loader store
jest.mock('@/stores/LoaderStore', () => ({
    __esModule: true,
    default: (selector: any) =>
        selector({
            isLoading: false,
            startLoading: jest.fn(),
            stopLoading: jest.fn(),
        }),
}))

// Categories hook
jest.mock('@/hooks/main/categories/useGetCategories', () => ({
    __esModule: true,
    default: () => ({
        categories: [
            { id: 1, name: 'Gunpla' },
            { id: 2, name: 'Robot' },
        ],
        fetchCategories: jest.fn(),
    }),
}))

// Add collection hook
jest.mock('@/hooks/main/collections/useAddCollectionItem', () => ({
    __esModule: true,
    default: () => ({
        addCollectionItem: jest.fn(),
    }),
}))

// Navigation mock
const navigateMock = jest.fn()

jest.mock('@react-navigation/core', () => ({
    useFocusEffect: (cb: any) => cb(),
}))

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: navigateMock,
    }),
}))

/* ---------------------------
   TEST SUITE
---------------------------- */

describe('DashboardCollectionAddScreen', () => {
    const route = { params: {} }
    const navigation = { navigate: navigateMock }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders main UI elements', () => {
        const { getByText } = render(
            <DashboardCollectionAddScreen
                route={route}
                navigation={navigation}
            />
        )

        // Header texts
        getByText('KIT_REGISTRY_CREATE')
        getByText('PROTOCOL_DATA_ENTRY')

        // Form labels
        getByText('DESIGNATION NAME')
        getByText('SERIES IDENTIFIER')
        getByText('SYSTEM CATEGORY')

        // Buttons
        getByText('COMMIT')
        getByText('ABORT')
    })

    it('renders date dropdown section', () => {
        const { getByText } = render(
            <DashboardCollectionAddScreen
                route={route}
                navigation={navigation}
            />
        )

        getByText('PROCUREMENT DATE')
    })

    it('navigates back when abort is pressed', () => {
        const { getByText } = render(
            <DashboardCollectionAddScreen
                route={route}
                navigation={navigation}
            />
        )

        fireEvent.press(getByText('ABORT'))

        expect(navigateMock).toHaveBeenCalled()
    })

    it('renders commit button (submit trigger exists)', () => {
        const { getByText } = render(
            <DashboardCollectionAddScreen
                route={route}
                navigation={navigation}
            />
        )

        const commitBtn = getByText('COMMIT')

        fireEvent.press(commitBtn)

        expect(commitBtn).toBeTruthy()
    })

    it('renders category dropdown label from API mock', () => {
        const { getByText } = render(
            <DashboardCollectionAddScreen
                route={route}
                navigation={navigation}
            />
        )

        getByText('SYSTEM CATEGORY')
    })
})
