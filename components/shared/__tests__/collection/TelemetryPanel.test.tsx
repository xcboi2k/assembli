import React from 'react'
import { render } from '@testing-library/react-native'
import TelemetryPanel from '@/components/shared/collection/TelemetryPanel'

describe('TelemetryPanel', () => {
    const mockStats = [
        { label: 'TOTAL', value: 10 },
        { label: 'ACTIVE', value: 5 },
    ]

    const mockBreakdown = [
        { label: 'Completed', value: '100%' },
        { label: 'Pending', value: '40%' },
    ]

    it('renders header correctly', () => {
        const { getByText } = render(
            <TelemetryPanel stats={mockStats} breakdown={mockBreakdown} />
        )

        expect(getByText('TELEMETRY_LOG')).toBeTruthy()
    })

    it('renders all stat items', () => {
        const { getByText } = render(
            <TelemetryPanel stats={mockStats} breakdown={mockBreakdown} />
        )

        expect(getByText('TOTAL')).toBeTruthy()
        expect(getByText('ACTIVE')).toBeTruthy()

        expect(getByText('10')).toBeTruthy()
        expect(getByText('5')).toBeTruthy()
    })

    it('renders breakdown rows correctly', () => {
        const { getByText } = render(
            <TelemetryPanel stats={mockStats} breakdown={mockBreakdown} />
        )

        expect(getByText('Completed')).toBeTruthy()
        expect(getByText('Pending')).toBeTruthy()

        expect(getByText('100%')).toBeTruthy()
        expect(getByText('40%')).toBeTruthy()
    })

    it('applies correct value rendering logic', () => {
        const { getByText } = render(
            <TelemetryPanel stats={mockStats} breakdown={mockBreakdown} />
        )

        const completed = getByText('100%')
        const pending = getByText('40%')

        expect(completed).toBeTruthy()
        expect(pending).toBeTruthy()
    })

    it('renders empty state safely', () => {
        const { toJSON } = render(<TelemetryPanel stats={[]} breakdown={[]} />)

        expect(toJSON()).toBeTruthy()
    })
})
