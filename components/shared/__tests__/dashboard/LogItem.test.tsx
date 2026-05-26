import React from 'react'
import { render } from '@testing-library/react-native'
import LogItem from '@/components/shared/dashboard/LogItem'

describe('LogItem', () => {
    it('renders time correctly', () => {
        const { getByText } = render(
            <LogItem time="2024-10-24 09:15:01" text="System initialized" />
        )

        expect(getByText('2024-10-24 09:15:01')).toBeTruthy()
    })

    it('renders log text correctly', () => {
        const { getByText } = render(
            <LogItem time="2024-10-24 09:15:01" text="System initialized" />
        )

        expect(getByText('System initialized')).toBeTruthy()
    })

    it('renders both time and text together', () => {
        const { getByText } = render(
            <LogItem time="2024-10-24 09:15:01" text="Surface primer applied" />
        )

        expect(getByText('2024-10-24 09:15:01')).toBeTruthy()
        expect(getByText('Surface primer applied')).toBeTruthy()
    })
})
