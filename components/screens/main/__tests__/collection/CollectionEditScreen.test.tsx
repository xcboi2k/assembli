import { render, fireEvent } from '@testing-library/react-native'
import CollectionEditScreen from '../../collections/CollectionEditScreen'

/**
 * MOCKS
 */

const mockUpdateCollectionItem = jest.fn()
const mockFetchCategories = jest.fn()
const mockNavigate = jest.fn()

/* navigation */
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
}))

/* categories */
jest.mock('@/hooks/main/categories/useGetCategories', () => ({
    __esModule: true,
    default: () => ({
        categories: [
            { id: 1, name: 'Gunpla' },
            { id: 2, name: 'Figure' },
        ],
        fetchCategories: mockFetchCategories,
    }),
}))

/* update hook */
jest.mock('@/hooks/main/collections/useUpdateCollectionItem', () => ({
    __esModule: true,
    default: () => ({
        updateCollectionItem: mockUpdateCollectionItem,
    }),
}))

/* loader store */
jest.mock('@/stores/LoaderStore', () => ({
    __esModule: true,
    default: (selector: any) =>
        selector({
            isLoading: false,
            startLoading: jest.fn(),
            stopLoading: jest.fn(),
        }),
}))

/**
 * TEST SUITE
 */
describe('CollectionEditScreen', () => {
    const route = {
        params: {
            id: 1,
            name: 'RX-78',
            series: 'UC Series',
        },
    }

    const navigation = {
        navigate: mockNavigate,
    }

    /**
     * -------------------------
     * RENDERING
     * -------------------------
     */
    it('renders pre-filled form values', () => {
        const { getByDisplayValue, getByText } = render(
            <CollectionEditScreen route={route} navigation={navigation} />
        )

        expect(getByDisplayValue('RX-78')).toBeOnTheScreen()
        expect(getByDisplayValue('UC Series')).toBeOnTheScreen()

        expect(getByText('KIT_REGISTRY_UPDATE')).toBeOnTheScreen()
    })

    /**
     * -------------------------
     * FORM SUBMISSION
     * -------------------------
     */
    it('calls updateCollectionItem on submit', () => {
        const { getByText, getByDisplayValue } = render(
            <CollectionEditScreen route={route} navigation={navigation} />
        )

        // change name
        fireEvent.changeText(getByDisplayValue('RX-78'), 'RX-78 UPDATED')

        // change series
        fireEvent.changeText(getByDisplayValue('UC Series'), 'UC UPDATED')

        // submit
        fireEvent.press(getByText('COMMIT'))

        expect(mockUpdateCollectionItem).toHaveBeenCalled()
    })

    /**
     * -------------------------
     * NAVIGATION (ABORT)
     * -------------------------
     */
    it('navigates back to home on abort', () => {
        const { getByText } = render(
            <CollectionEditScreen route={route} navigation={navigation} />
        )

        fireEvent.press(getByText('ABORT'))

        expect(mockNavigate).toHaveBeenCalledWith('CollectionHome')
    })

    /**
     * -------------------------
     * CATEGORY FETCH
     * -------------------------
     */
    it('fetches categories on focus', () => {
        render(<CollectionEditScreen route={route} navigation={navigation} />)

        expect(mockFetchCategories).toHaveBeenCalled()
    })
})
