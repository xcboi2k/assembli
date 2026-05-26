import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import FilterTabs from '@/components/shared/collection/FilterTabs'

describe('FilterTabs', () => {
    it('renders all tabs', () => {
        const setActive = jest.fn()

        const { getByText } = render(
            <FilterTabs active="ALL" setActive={setActive} />
        )

        expect(getByText('ALL')).toBeTruthy()
        expect(getByText('GUNPLA')).toBeTruthy()
        expect(getByText('LEGO')).toBeTruthy()
        expect(getByText('OTHER')).toBeTruthy()
    })

    it('calls setActive when a tab is pressed', () => {
        const setActive = jest.fn()

        const { getByText } = render(
            <FilterTabs active="ALL" setActive={setActive} />
        )

        fireEvent.press(getByText('GUNPLA'))

        expect(setActive).toHaveBeenCalledWith('GUNPLA')
    })

    it('calls setActive for different tabs correctly', () => {
        const setActive = jest.fn()

        const { getByText } = render(
            <FilterTabs active="LEGO" setActive={setActive} />
        )

        fireEvent.press(getByText('OTHER'))

        expect(setActive).toHaveBeenCalledWith('OTHER')
    })
})
