import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import CategorySummary from '@/components/shared/categories/CategorySummary'

describe('CategorySummary', () => {
    const mockData = [{ id: 1 }, { id: 2 }, { id: 3 }]

    it('renders correct active record count', () => {
        const { getByText } = render(
            <CategorySummary data={mockData} handleNavigation={() => {}} />
        )

        expect(getByText('ACTIVE_RECORDS')).toBeTruthy()
        expect(getByText('3')).toBeTruthy()
    })

    it('renders 0 when data is undefined', () => {
        const { getByText } = render(
            <CategorySummary data={undefined} handleNavigation={() => {}} />
        )

        expect(getByText('0')).toBeTruthy()
    })

    it('calls handleNavigation when Add Category is pressed', () => {
        const handleNavigation = jest.fn()

        const { getByText } = render(
            <CategorySummary
                data={mockData}
                handleNavigation={handleNavigation}
            />
        )

        fireEvent.press(getByText('ADD_CATEGORY'))

        expect(handleNavigation).toHaveBeenCalledTimes(1)
    })

    it('renders system status as OPERATIONAL', () => {
        const { getByText } = render(
            <CategorySummary data={mockData} handleNavigation={() => {}} />
        )

        expect(getByText('SYSTEM_STATUS')).toBeTruthy()
        expect(getByText('OPERATIONAL')).toBeTruthy()
    })
})
