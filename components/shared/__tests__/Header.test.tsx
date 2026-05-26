import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import Header from '@/components/shared/Header'

// MOCK react-navigation
const mockNavigate = jest.fn()

jest.mock('@react-navigation/core', () => {
    return {
        useNavigation: () => ({
            navigate: mockNavigate,
        }),
    }
})

describe('Header', () => {
    beforeEach(() => {
        mockNavigate.mockClear()
    })

    it('renders title correctly', () => {
        const { getByText } = render(<Header title="PROFILE" />)

        expect(getByText('ASSEMBLI')).toBeTruthy()
        expect(getByText('PROFILE')).toBeTruthy()
    })

    it('renders default cog icon when variant is default', () => {
        const { getByText } = render(<Header title="TEST" />)

        expect(getByText('TEST')).toBeTruthy()
    })

    it('navigates to ProfileMenu when icon is pressed', () => {
        const { getByRole } = render(<Header title="TEST" />)

        const button = getByRole('button')
        fireEvent.press(button)

        expect(mockNavigate).toHaveBeenCalledWith('ProfileMenu')
    })

    it('renders back icon when variant is not default', () => {
        const { getByText } = render(<Header title="TEST" variant="back" />)

        expect(getByText('TEST')).toBeTruthy()
    })
})
