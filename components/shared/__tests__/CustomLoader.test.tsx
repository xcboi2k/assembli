import React from 'react'
import { render } from '@testing-library/react-native'
import CustomLoader from '@/components/shared/CustomLoader'

// Mock Animated (prevents timing + loop issues)
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')

// Optional: simplify Animated so tests don’t depend on timing
jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native')

    RN.Animated.loop = (animation: any) => ({
        start: jest.fn(),
    })

    RN.Animated.timing = () => ({
        start: jest.fn(),
    })

    RN.Animated.sequence = (arr: any) => arr

    return RN
})

describe('CustomLoader', () => {
    it('does not render content when visible is false', () => {
        const { queryByText } = render(<CustomLoader visible={false} />)

        expect(queryByText('SYSTEM_SYNCHRONIZATION')).toBeNull()
    })

    it('renders default title and subtitle when visible', () => {
        const { getByText } = render(<CustomLoader visible={true} />)

        expect(getByText('SYSTEM_SYNCHRONIZATION')).toBeTruthy()
        expect(getByText('INITIALIZING OPERATOR ENVIRONMENT')).toBeTruthy()
    })

    it('renders custom title and subtitle', () => {
        const { getByText } = render(
            <CustomLoader
                visible={true}
                title="LOADING_DATA"
                subtitle="PLEASE WAIT"
            />
        )

        expect(getByText('LOADING_DATA')).toBeTruthy()
        expect(getByText('PLEASE WAIT')).toBeTruthy()
    })

    it('renders status labels', () => {
        const { getByText } = render(<CustomLoader visible={true} />)

        expect(getByText('ACTIVE_PROCESS')).toBeTruthy()
        expect(getByText('CONNECTED')).toBeTruthy()
        expect(getByText('NODE_VERSION')).toBeTruthy()
    })
})
