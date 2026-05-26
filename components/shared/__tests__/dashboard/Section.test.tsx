import React from 'react'
import { render } from '@testing-library/react-native'
import { Text } from 'react-native'
import Section from '@/components/shared/dashboard/Section'

describe('Section', () => {
    it('renders title correctly', () => {
        const { getByText } = render(
            <Section title="UPCOMING_TASKS">
                <Text>Child Content</Text>
            </Section>
        )

        expect(getByText('UPCOMING_TASKS')).toBeTruthy()
    })

    it('renders children correctly', () => {
        const { getByText } = render(
            <Section title="LOGS">
                <Text>Log Item</Text>
            </Section>
        )

        expect(getByText('Log Item')).toBeTruthy()
    })

    it('does not show add button when showAdd is false', () => {
        const { queryByTestId } = render(
            <Section title="LOGS">
                <Text>Content</Text>
            </Section>
        )

        expect(queryByTestId('section-add-button')).toBeNull()
    })

    it('shows add button when showAdd is true', () => {
        const { getByTestId } = render(
            <Section title="LOGS" showAdd>
                <Text>Content</Text>
            </Section>
        )

        expect(getByTestId('section-add-button')).toBeTruthy()
    })
})
