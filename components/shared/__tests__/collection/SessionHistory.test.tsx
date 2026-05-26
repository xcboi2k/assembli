import React from 'react'
import { render } from '@testing-library/react-native'
import { SessionHistory } from '@/components/shared/collection/SessionHistory'

describe('SessionHistory', () => {
    const mockSessions = [
        {
            title: 'Added RX-78 model',
            date: '2026-01-01',
            time: '10:30 AM',
        },
        {
            title: 'Updated category LEGO',
            date: '2026-01-02',
            time: '02:15 PM',
        },
    ]

    it('renders header correctly', () => {
        const { getByText } = render(<SessionHistory sessions={mockSessions} />)

        expect(getByText('SESSION_HISTORY')).toBeTruthy()
    })

    it('renders all session items', () => {
        const { getByText } = render(<SessionHistory sessions={mockSessions} />)

        expect(getByText('Added RX-78 model')).toBeTruthy()
        expect(getByText('Updated category LEGO')).toBeTruthy()
    })

    it('renders session dates and times', () => {
        const { getByText } = render(<SessionHistory sessions={mockSessions} />)

        expect(getByText('2026-01-01')).toBeTruthy()
        expect(getByText('10:30 AM')).toBeTruthy()

        expect(getByText('2026-01-02')).toBeTruthy()
        expect(getByText('02:15 PM')).toBeTruthy()
    })

    it('renders footer text', () => {
        const { getByText } = render(<SessionHistory sessions={mockSessions} />)

        expect(getByText('VIEW_ALL_LOGS')).toBeTruthy()
    })

    it('renders empty state gracefully', () => {
        const { getByText } = render(<SessionHistory sessions={[]} />)

        expect(getByText('VIEW_ALL_LOGS')).toBeTruthy()
    })
})
