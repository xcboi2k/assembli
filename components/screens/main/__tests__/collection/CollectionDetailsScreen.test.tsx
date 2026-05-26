import { render, fireEvent } from '@testing-library/react-native'
import CollectionDetailsScreen from '../../collections/CollectionDetailsScreen'

/**
 * MOCKS
 */

const mockGetByCollectionId = jest.fn()
const mockNavigate = jest.fn()

/* navigation */
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
}))

/* route params handled inline in tests */

/* loader store */
jest.mock('@/stores/LoaderStore', () => ({
    __esModule: true,
    default: (selector: any) =>
        selector({
            isLoading: false,
        }),
}))

/* data hook */
jest.mock('@/hooks/main/useGetCollectionsTree', () => ({
    __esModule: true,
    default: () => ({
        getByCollectionId: mockGetByCollectionId,
        data: [
            {
                id: 1,
                name: 'RX-78 GUNDAM',
                tasks: [
                    { id: 1, name: 'Task A' },
                    { id: 2, name: 'Task B' },
                ],
            },
        ],
        loading: false,
    }),
}))

/* progress helper */
jest.mock('@/helpers/computeBuildProgress', () => ({
    computeBuildProgress: () => 0.5,
}))

/* checklist (simplify UI dependency) */
jest.mock(
    '@/components/shared/collection/BuildChecklist',
    () => 'BuildChecklist'
)

/* skeletons */
jest.mock(
    '@/components/skeletons/BuildChecklistSkeleton',
    () => 'BuildChecklistSkeleton'
)
jest.mock(
    '@/components/skeletons/CollectionDetailsHeaderSkeleton',
    () => 'HeaderSkeleton'
)

/**
 * TEST SUITE
 */
describe('CollectionDetailsScreen', () => {
    const route = {
        params: 1,
    }

    const navigation = {
        navigate: mockNavigate,
    }

    /**
     * -------------------------
     * RENDERING
     * -------------------------
     */
    it('renders collection details correctly', () => {
        const { getByText } = render(
            <CollectionDetailsScreen route={route} navigation={navigation} />
        )

        expect(getByText('RX-78 GUNDAM')).toBeOnTheScreen()
        expect(getByText('50%')).toBeOnTheScreen()
    })

    /**
     * -------------------------
     * DATA FETCH
     * -------------------------
     */
    it('fetches collection on focus', () => {
        render(
            <CollectionDetailsScreen route={route} navigation={navigation} />
        )

        expect(mockGetByCollectionId).toHaveBeenCalledWith(1)
    })

    /**
     * -------------------------
     * NAVIGATION (EDIT)
     * -------------------------
     */
    it('navigates to edit screen', () => {
        const { getByTestId } = render(
            <CollectionDetailsScreen route={route} navigation={navigation} />
        )

        // NOTE: You should add testID to edit button for reliability
        // fireEvent.press(getByTestId('edit-collection'));

        // fallback if no testID:
        fireEvent.press(getByText('RX-78 GUNDAM').parent?.children?.[1])

        expect(mockNavigate).toHaveBeenCalled()
    })

    /**
     * -------------------------
     * EMPTY STATE
     * -------------------------
     */
    it('shows empty state when no tasks exist', () => {
        jest.doMock('@/hooks/main/useGetCollectionsTree', () => ({
            __esModule: true,
            default: () => ({
                getByCollectionId: mockGetByCollectionId,
                data: [
                    {
                        id: 1,
                        name: 'RX-78 GUNDAM',
                        tasks: [],
                    },
                ],
                loading: false,
            }),
        }))

        const { getByText } = render(
            <CollectionDetailsScreen route={route} navigation={navigation} />
        )

        expect(getByText('NO_TASKS_FOUND')).toBeOnTheScreen()
    })

    /**
     * -------------------------
     * CHECKLIST RENDER
     * -------------------------
     */
    it('renders checklist when tasks exist', () => {
        const { getByText } = render(
            <CollectionDetailsScreen route={route} navigation={navigation} />
        )

        expect(getByText('BuildChecklist')).toBeOnTheScreen()
    })
})
