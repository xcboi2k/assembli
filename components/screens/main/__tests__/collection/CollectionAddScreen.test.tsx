import { render, fireEvent } from '@testing-library/react-native'
import CollectionAddScreen from '../../collections/CollectionAddScreen'

/**
 * MOCKS
 */

const mockAddCollectionItem = jest.fn()
const mockFetchCategories = jest.fn()
const mockNavigate = jest.fn()

/* navigation */
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
}))

/* categories hook */
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

/* add collection hook */
jest.mock('@/hooks/main/collections/useAddCollectionItem', () => ({
    __esModule: true,
    default: () => ({
        addCollectionItem: mockAddCollectionItem,
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
describe('CollectionAddScreen', () => {
    /**
     * -------------------------
     * RENDERING
     * -------------------------
     */
    it('renders main UI elements', () => {
        const { getByText, getByPlaceholderText } = render(
            <CollectionAddScreen route={{} as any} navigation={{} as any} />
        )

        expect(getByText('KIT_REGISTRY_CREATE')).toBeOnTheScreen()

        expect(getByPlaceholderText('e.g. RX-78-2 GUNDAM')).toBeOnTheScreen()

        expect(getByPlaceholderText('e.g. GUNDAM')).toBeOnTheScreen()

        expect(getByText('COMMIT')).toBeOnTheScreen()
    })

    /**
     * -------------------------
     * FORM SUBMISSION
     * -------------------------
     */
    it('submits collection item when form is valid', () => {
        const { getByText, getByPlaceholderText } = render(
            <CollectionAddScreen route={{} as any} navigation={{} as any} />
        )

        // fill form
        fireEvent.changeText(
            getByPlaceholderText('e.g. RX-78-2 GUNDAM'),
            'RX-78'
        )

        fireEvent.changeText(getByPlaceholderText('e.g. GUNDAM'), 'UC Series')

        // select category (simplified assumption)
        // NOTE: depends on your CustomDropdown implementation
        fireEvent.press(getByText('COMMIT'))

        expect(mockAddCollectionItem).toHaveBeenCalled()
    })

    /**
     * -------------------------
     * NAVIGATION (ABORT)
     * -------------------------
     */
    it('navigates back on abort', () => {
        const { getByText } = render(
            <CollectionAddScreen route={{} as any} navigation={{} as any} />
        )

        fireEvent.press(getByText('ABORT'))

        expect(mockNavigate).toHaveBeenCalledWith('DashboardHome')
    })

    /**
     * -------------------------
     * CATEGORY FETCH
     * -------------------------
     */
    it('fetches categories on mount/focus', () => {
        render(<CollectionAddScreen route={{} as any} navigation={{} as any} />)

        expect(mockFetchCategories).toHaveBeenCalled()
    })
})
