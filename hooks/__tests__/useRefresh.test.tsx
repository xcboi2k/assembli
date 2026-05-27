import { renderHook, act } from '@testing-library/react-native'
import { useRefresh } from '../useRefresh'

describe('useRefresh', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.runOnlyPendingTimers()
        jest.useRealTimers()
        jest.clearAllMocks()
    })

    it('initializes with refreshing false', () => {
        const { result } = renderHook(() =>
            useRefresh({
                postRefresh: jest.fn(),
            })
        )

        expect(result.current.refreshing).toBe(false)
    })

    it('sets refreshing to true immediately on refresh', () => {
        const { result } = renderHook(() =>
            useRefresh({
                postRefresh: jest.fn(),
            })
        )

        act(() => {
            result.current.onRefresh()
        })

        expect(result.current.refreshing).toBe(true)
    })

    it('calls postRefresh when onRefresh is triggered', () => {
        const postRefresh = jest.fn()

        const { result } = renderHook(() =>
            useRefresh({
                postRefresh,
            })
        )

        act(() => {
            result.current.onRefresh()
        })

        expect(postRefresh).toHaveBeenCalledTimes(1)
    })

    it('sets refreshing back to false after 2 seconds', () => {
        const { result } = renderHook(() =>
            useRefresh({
                postRefresh: jest.fn(),
            })
        )

        act(() => {
            result.current.onRefresh()
        })

        expect(result.current.refreshing).toBe(true)

        act(() => {
            jest.advanceTimersByTime(2000)
        })

        expect(result.current.refreshing).toBe(false)
    })

    it('works without postRefresh callback', () => {
        const { result } = renderHook(() => useRefresh({}))

        act(() => {
            result.current.onRefresh()
        })

        expect(result.current.refreshing).toBe(true)

        act(() => {
            jest.advanceTimersByTime(2000)
        })

        expect(result.current.refreshing).toBe(false)
    })

    it('allows manual setRefreshing usage', () => {
        const { result } = renderHook(() =>
            useRefresh({
                postRefresh: jest.fn(),
            })
        )

        act(() => {
            result.current.setRefreshing(true)
        })

        expect(result.current.refreshing).toBe(true)

        act(() => {
            result.current.setRefreshing(false)
        })

        expect(result.current.refreshing).toBe(false)
    })
})
