import React from 'react'
import { render } from '@testing-library/react-native'
import BacklogCard from '@/components/shared/dashboard/BacklogCard'

describe('BacklogCard', () => {
    it('renders title correctly', () => {
        const { getByText } = render(<BacklogCard title="PROJECT_A" />)

        expect(getByText('PROJECT_A')).toBeTruthy()
    })

    it('renders subtitle when provided', () => {
        const { getByText } = render(
            <BacklogCard title="PROJECT_A" subtitle="CURRENT_PROJECT" />
        )

        expect(getByText('CURRENT_PROJECT')).toBeTruthy()
    })

    it('renders badge text when provided', () => {
        const { getByText } = render(
            <BacklogCard title="PROJECT_A" badgeText="50% COMPLETE" />
        )

        expect(getByText('50% COMPLETE')).toBeTruthy()
    })

    it('renders progress percentage correctly', () => {
        const { getByText } = render(
            <BacklogCard title="PROJECT_A" progress={0.75} />
        )

        expect(getByText('75%')).toBeTruthy()
    })

    it('renders 0% when progress is not provided', () => {
        const { getByText } = render(<BacklogCard title="PROJECT_A" />)

        expect(getByText('0%')).toBeTruthy()
    })

    it('supports different variants', () => {
        const { rerender, getByText } = render(
            <BacklogCard title="PROJECT_A" variant="current" />
        )

        expect(getByText('PROJECT_A')).toBeTruthy()

        rerender(<BacklogCard title="PROJECT_A" variant="completed" />)

        expect(getByText('PROJECT_A')).toBeTruthy()
    })
})
