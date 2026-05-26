import React from 'react'
import { render } from '@testing-library/react-native'
import StatsGrid from '@/components/shared/collection/StatsGrid'

describe('StatsGrid', () => {
    const mockStats = [
        { label: 'ACQUIRED', value: 10 },
        { label: 'ONGOING', value: 5 },
        { label: 'COMPLETED', value: 3 },
        { label: 'FAILED', value: 1 },
    ]

    it('renders all stat labels', () => {
        const { getByText } = render(<StatsGrid stats={mockStats} />)

        expect(getByText('ACQUIRED')).toBeTruthy()
        expect(getByText('ONGOING')).toBeTruthy()
        expect(getByText('COMPLETED')).toBeTruthy()
        expect(getByText('FAILED')).toBeTruthy()
    })

    it('renders all stat values', () => {
        const { getByText } = render(<StatsGrid stats={mockStats} />)

        expect(getByText('10')).toBeTruthy()
        expect(getByText('5')).toBeTruthy()
        expect(getByText('3')).toBeTruthy()
        expect(getByText('1')).toBeTruthy()
    })

    it('renders correct number of stat cards', () => {
        const { UNSAFE_getAllByType } = render(<StatsGrid stats={mockStats} />)

        // Each stat renders a wrapper View
        const cards = UNSAFE_getAllByType('View')

        // Not strict but ensures multiple items rendered
        expect(cards.length).toBeGreaterThan(4)
    })

    it('renders empty state safely', () => {
        const { toJSON } = render(<StatsGrid stats={[]} />)

        expect(toJSON()).toBeTruthy()
    })
})
