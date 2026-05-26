import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import DashboardScreen from '../../dashboard/DashboardScreen'

/* ---------------------------
   MOCK: navigation
---------------------------- */
const navigateMock = jest.fn()

jest.mock('@react-navigation/core', () => ({
    useFocusEffect: (cb: any) => cb(),
    useNavigation: () => ({
        navigate: navigateMock,
    }),
}))

/* ---------------------------
   MOCK: dashboard data hook
---------------------------- */
jest.mock('@/hooks/main/useGetDashboardChartsData', () => ({
    __esModule: true,
    default: () => ({
        loading: false,
        refetch: jest.fn(),
        analytics: {
            highest: {
                name: 'UNICORN_GUNDAM',
                progress: 0.7,
            },
            lowest: {
                name: 'RX-78-2',
                progress: 0.2,
            },
            recentCompleted: {
                name: 'ZAKU-II',
            },
            heatMapData: [
                { date: '2026-01-01', value: 2 },
                { date: '2026-01-02', value: 4 },
            ],
            stats: {
                acquired: 12,
                ongoing: 5,
                completed: 9,
            },
        },
    }),
}))

/* ---------------------------
   TEST SUITE
---------------------------- */

describe('DashboardScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders main dashboard UI', () => {
        const { getByText } = render(<DashboardScreen />)

        getByText('SYSTEM_STATUS: NOMINAL')
        getByText('BUILD_ACTIVITY_LOG')
    })

    it('renders add collection card and triggers navigation', () => {
        const { getByText } = render(<DashboardScreen />)

        const addCard = getByText(/add/i)

        fireEvent.press(addCard)

        expect(navigateMock).toHaveBeenCalledWith('DashboardCollectionAdd')
    })

    it('renders backlog cards from analytics', () => {
        const { getByText } = render(<DashboardScreen />)

        getByText('UNICORN_GUNDAM')
        getByText('RX-78-2')
    })

    it('renders stats cards', () => {
        const { getByText } = render(<DashboardScreen />)

        getByText('ACQUIRED')
        getByText('ONGOING')
        getByText('COMPLETED')
    })

    it('renders heatmap section', () => {
        const { getByText } = render(<DashboardScreen />)

        getByText('BUILD_ACTIVITY_LOG')
    })
})
