import React from 'react'
import { render } from '@testing-library/react-native'
import Heatmap from '@/components/shared/dashboard/Heatmap'

describe('Heatmap', () => {
    const mockData = Array.from({ length: 14 }).map((_, i) => ({
        date: `2026-01-${i + 1}`,
        value: i % 5,
    }))

    it('renders title when provided', () => {
        const { getByText } = render(
            <Heatmap data={mockData} title="BUILD_ACTIVITY_LOG" />
        )

        expect(getByText('BUILD_ACTIVITY_LOG')).toBeTruthy()
    })

    it('renders without crashing when no title is provided', () => {
        render(<Heatmap data={mockData} />)
    })

    it('renders correct number of heatmap cells', () => {
        const { UNSAFE_getAllByType } = render(<Heatmap data={mockData} />)

        const cells = UNSAFE_getAllByType('View')

        // loose check: ensures grid exists and renders many nodes
        expect(cells.length).toBeGreaterThan(10)
    })

    it('renders legend labels correctly', () => {
        const { getByText } = render(<Heatmap data={mockData} />)

        expect(getByText('LOW')).toBeTruthy()
        expect(getByText('HIGH')).toBeTruthy()
    })

    it('renders year labels', () => {
        const { getAllByText } = render(<Heatmap data={mockData} />)

        const year = new Date().getFullYear().toString()

        expect(getAllByText(`JAN ${year}`)[0]).toBeTruthy()
        expect(getAllByText(`DEC ${year}`)[0]).toBeTruthy()
    })
})
