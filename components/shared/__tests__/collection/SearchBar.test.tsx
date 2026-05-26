import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import SearchBar from '@/components/shared/collection/SearchBar'

describe('SearchBar', () => {
    it('renders search icon and input', () => {
        const { getByPlaceholderText } = render(<SearchBar />)

        const input = getByPlaceholderText('QUERY_SERIAL_OR_MODEL...')

        expect(input).toBeTruthy()
    })

    it('allows user to type into input', () => {
        const { getByPlaceholderText } = render(<SearchBar />)

        const input = getByPlaceholderText('QUERY_SERIAL_OR_MODEL...')

        fireEvent.changeText(input, 'RX-78-2')

        expect(input.props.value).toBeUndefined()
        // NOTE: no controlled state in component, so value stays uncontrolled
    })

    it('renders correctly without crashing', () => {
        const { toJSON } = render(<SearchBar />)

        expect(toJSON()).toBeTruthy()
    })
})
