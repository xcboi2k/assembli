import React from 'react'
import { render } from '@testing-library/react-native'
import StatCard from '@/components/shared/dashboard/StatCard'

describe('StatCard', () => {
    it('renders label correctly', () => {
        const { getByText } = render(<StatCard label="ACQUIRED" value={10} />)

        expect(getByText('ACQUIRED')).toBeTruthy()
    })

    it('renders value correctly', () => {
        const { getByText } = render(<StatCard label="ACQUIRED" value={10} />)

        expect(getByText('10')).toBeTruthy()
    })

    it('applies highlight style when highlight is true', () => {
        const { getByText } = render(
            <StatCard label="ONGOING" value={5} highlight />
        )

        const valueText = getByText('5')

        // basic assertion that it exists
        expect(valueText).toBeTruthy()

        // optional: check style prop contains highlight color
        expect(valueText.props.className).toContain('text-[#3b82f6]')
    })

    it('does not apply highlight style when false', () => {
        const { getByText } = render(<StatCard label="ONGOING" value={5} />)

        const valueText = getByText('5')

        expect(valueText.props.className).toContain('text-white')
    })
})
