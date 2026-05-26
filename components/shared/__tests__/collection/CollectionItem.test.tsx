import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import CollectionItem from '@/components/shared/collection/CollectionItem'

describe('CollectionItem', () => {
    const baseProps = {
        header: 'UNIT_001',
        title: 'RX-78',
        subtitle: 'GUNDAM',
    }

    it('renders header, title and subtitle', () => {
        const { getByText } = render(<CollectionItem {...baseProps} />)

        expect(getByText('UNIT_001')).toBeTruthy()
        expect(getByText('RX-78')).toBeTruthy()
        expect(getByText('GUNDAM')).toBeTruthy()
    })

    it('renders variant badge correctly', () => {
        const { getByText } = render(
            <CollectionItem {...baseProps} variant="completed" />
        )

        expect(getByText('COMPLETED')).toBeTruthy()
    })

    it('calls onPress when pressed', () => {
        const onPress = jest.fn()

        const { getByText } = render(
            <CollectionItem {...baseProps} onPress={onPress} />
        )

        fireEvent.press(getByText('RX-78'))

        expect(onPress).toHaveBeenCalledTimes(1)
    })

    it('renders progress bar when progress is provided', () => {
        const { getByText, UNSAFE_getByType } = render(
            <CollectionItem {...baseProps} progress={0.5} />
        )

        expect(getByText('COMPLETION')).toBeTruthy()

        // progress bar exists via View (simple presence check)
        const progressContainer = UNSAFE_getByType('View')
        expect(progressContainer).toBeTruthy()
    })

    it('does NOT render progress when undefined', () => {
        const { queryByText } = render(<CollectionItem {...baseProps} />)

        expect(queryByText('COMPLETION')).toBeNull()
    })

    it('renders footer when provided', () => {
        const { getByText } = render(
            <CollectionItem
                {...baseProps}
                footerLabel="ACQUIRED"
                footerValue="2026-01-01"
            />
        )

        expect(getByText('ACQUIRED')).toBeTruthy()
        expect(getByText('2026-01-01')).toBeTruthy()
    })

    it('handles default variant safely', () => {
        const { getByText } = render(<CollectionItem {...baseProps} />)

        expect(getByText('PENDING')).toBeTruthy()
    })
})
