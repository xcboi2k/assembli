import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import AddCollectionCard from '@/components/shared/dashboard/AddCollectionCard'

describe('AddCollectionCard', () => {
    it('renders main texts correctly', () => {
        const { getByText } = render(<AddCollectionCard />)

        expect(getByText('COLLECTION_NODE')).toBeTruthy()
        expect(getByText('ADD_NEW_COLLECTION')).toBeTruthy()
        expect(
            getByText(
                'Register a new unit into the active operator inventory system.'
            )
        ).toBeTruthy()
    })

    it('renders footer status correctly', () => {
        const { getByText } = render(<AddCollectionCard />)

        expect(getByText('SYSTEM_ACCESS')).toBeTruthy()
        expect(getByText('READY')).toBeTruthy()
        expect(getByText('INITIALIZE')).toBeTruthy()
    })

    it('calls onPress when pressed', () => {
        const onPress = jest.fn()

        const { getByText } = render(<AddCollectionCard onPress={onPress} />)

        fireEvent.press(getByText('ADD_NEW_COLLECTION'))

        expect(onPress).toHaveBeenCalled()
    })

    it('calls onPress when card is pressed (outer container)', () => {
        const onPress = jest.fn()

        const { getByText } = render(<AddCollectionCard onPress={onPress} />)

        fireEvent.press(getByText('INITIALIZE'))

        expect(onPress).toHaveBeenCalled()
    })

    it('renders without crashing', () => {
        const { toJSON } = render(<AddCollectionCard />)

        expect(toJSON()).toBeTruthy()
    })
})
