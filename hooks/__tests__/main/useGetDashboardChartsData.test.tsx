import { renderHook, act } from '@testing-library/react-native'
import useGetDashboardChartsData from '@/hooks/main/useGetDashboardChartsData'

// ---------------- mocks ----------------
jest.mock('@/stores/UserStore', () => ({
    __esModule: true,
    default: (selector: any) =>
        selector({
            user: { id: 1 },
        }),
}))

jest.mock('@/hooks/main/collections/useGetCollectionsTree', () => ({
    __esModule: true,
    default: () => ({
        data: [],
        getByUserId: jest.fn().mockResolvedValue(undefined),
    }),
}))

jest.mock('@sentry/react-native', () => ({
    captureException: jest.fn(),
}))

describe('useGetDashboardChartsData', () => {
    it('returns initial analytics structure when no data', () => {
        const { result } = renderHook(() => useGetDashboardChartsData())

        expect(result.current.loading).toBe(false)
        expect(result.current.analytics).toHaveProperty('highest', null)
        expect(result.current.analytics).toHaveProperty('lowest', null)
        expect(result.current.analytics).toHaveProperty('heatMapData')
        expect(result.current.analytics.stats).toEqual({
            acquired: 0,
            ongoing: 0,
            completed: 0,
        })
    })

    it('exposes refetch function', () => {
        const { result } = renderHook(() => useGetDashboardChartsData())

        expect(typeof result.current.refetch).toBe('function')
    })

    it('calls getByUserId on mount when user exists', async () => {
        const {
            getByUserId,
        } = require('@/hooks/main/collections/useGetCollectionsTree')

        const { result } = renderHook(() => useGetDashboardChartsData())

        await act(async () => {
            await result.current.refetch()
        })

        expect(getByUserId).toHaveBeenCalledWith(1)
    })
})
