import { render, fireEvent } from '@testing-library/react-native'
import CollectionScreen from '../../collections/CollectionScreen'

/**
 * MOCKS
 */

const mockGetByUserId = jest.fn()
const mockNavigate = jest.fn()
const mockOnRefresh = jest.fn()

/* navigation */
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
}))

/* collections hook */
jest.mock('@/hooks/main/useGetCollectionsTree', () => ({
    __esModule: true,
    default: () => ({
        getByUserId: mockGetByUserId,
        data: [
            {
                id: 1,
                name: 'RX-78',
                series: 'UC Series',
                tasks: [],
                status: 'active',
            },
        ],
        analytics: {
            totalCollections: 5,
            overallCompletionRate: 80,
            completedTasks: 10,
            completedSubtasks: 25,
        },
        loading: false,
    }),
}))

/* refresh hook */
jest.mock('@/hooks/useRefresh', () => ({
    useRefresh: () => ({
        refreshing: false,
        onRefresh: mockOnRefresh,
    }),
}))

/* progress helper */
jest.mock('@/helpers/computeBuildProgress', () => ({
    computeBuildProgress: () => 0.5,
}))

/* UI components (simplified) */
jest.mock('@/components/shared/Header', () => 'Header')
jest.mock('@/components/shared/collection/SearchBar', () => 'SearchBar')
jest.mock('@/components/shared/collection/FilterTabs', () => 'FilterTabs')
jest.mock(
    '@/components/shared/collection/CollectionItem',
    () => 'CollectionItem'
)
jest.mock('@/components/shared/collection/StatsGrid', () => 'StatsGrid')
jest.mock(
    '@/components/skeletons/CollectionSkeleton',
    () => 'CollectionSkeleton'
)

/**
 * TEST SUITE
 */
describe('CollectionScreen', () => {
    /**
     * -------------------------
     * RENDERING (DATA STATE)
     * -------------------------
     */
    it('renders collection list when data exists', () => {
        const { getByText } = render(<CollectionScreen />)

        expect(getByText('RX-78')).toBeOnTheScreen()
        expect(getByText('UC Series')).toBeOnTheScreen()
    })

    /**
     * -------------------------
     * FETCH ON FOCUS
     * -------------------------
     */
    it('fetches collections on focus', () => {
        render(<CollectionScreen />)

        expect(mockGetByUserId).toHaveBeenCalled()
    })

    /**
     * -------------------------
     * NAVIGATION
     * -------------------------
     */
    it('navigates to details screen on item press', () => {
        const { getByText } = render(<CollectionScreen />)

        fireEvent.press(getByText('RX-78'))

        expect(mockNavigate).toHaveBeenCalledWith('CollectionDetails', 1)
    })

    /**
     * -------------------------
     * EMPTY STATE
     * -------------------------
     */
    it('renders empty state when no data exists', () => {
        jest.doMock('@/hooks/main/useGetCollectionsTree', () => ({
            __esModule: true,
            default: () => ({
                getByUserId: mockGetByUserId,
                data: [],
                analytics: null,
                loading: false,
            }),
        }))

        const { getByText } = render(<CollectionScreen />)

        expect(getByText('ADD_NEW_COLLECTION')).toBeOnTheScreen()
    })

    /**
     * -------------------------
     * ANALYTICS RENDER
     * -------------------------
     */
    it('renders stats grid when analytics exists', () => {
        const { getByText } = render(<CollectionScreen />)

        expect(getByText('TOTAL_COLLECTIONS')).toBeOnTheScreen()
        expect(getByText('COMPLETION_RATE')).toBeOnTheScreen()
    })
})
