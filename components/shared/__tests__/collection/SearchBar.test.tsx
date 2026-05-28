import React from 'react'
import { render, fireEvent, act } from '@testing-library/react-native'
import SearchBar from '@/components/shared/collection/SearchBar'

jest.useFakeTimers()

describe('SearchBar', () => {
    const mockOnChange = jest.fn()
    const mockSetActiveTab = jest.fn()

    const defaultProps = {
        onChange: mockOnChange,
        tabs: [
            { id: 1, name: 'Tab 1' },
            { id: 2, name: 'Tab 2' },
        ],
        activeTab: 1,
        setActiveTab: mockSetActiveTab,
        loadingCategories: false,
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders search input', () => {
        const { getByPlaceholderText } = render(<SearchBar {...defaultProps} />)

        expect(getByPlaceholderText('QUERY_SERIAL_OR_MODEL...')).toBeTruthy()
    })

    it('updates search input', () => {
        const { getByPlaceholderText } = render(<SearchBar {...defaultProps} />)

        const input = getByPlaceholderText('QUERY_SERIAL_OR_MODEL...')

        fireEvent.changeText(input, 'test search')

        expect(input.props.value).toBe('test search')
    })

    it('calls onChange after debounce', async () => {
        const { getByPlaceholderText } = render(<SearchBar {...defaultProps} />)

        const input = getByPlaceholderText('QUERY_SERIAL_OR_MODEL...')

        fireEvent.changeText(input, 'hello')

        act(() => {
            jest.advanceTimersByTime(500)
        })

        expect(mockOnChange).toHaveBeenCalledWith({
            search: 'hello',
            activeTab: 1,
        })
    })

    it('triggers manual search immediately', async () => {
        const { getByPlaceholderText, getByTestId } = render(
            <SearchBar {...defaultProps} />
        )

        const input = getByPlaceholderText('QUERY_SERIAL_OR_MODEL...')

        fireEvent.changeText(input, 'manual search')

        const button = getByTestId('manual-search-button')

        fireEvent.press(button)

        await act(async () => {
            jest.runAllTimers()
        })

        expect(mockOnChange).toHaveBeenCalled()
    })

    it('clears search input', () => {
        const { getByPlaceholderText, getByTestId } = render(
            <SearchBar {...defaultProps} />
        )

        const input = getByPlaceholderText('QUERY_SERIAL_OR_MODEL...')

        fireEvent.changeText(input, 'something')

        const clearBtn = getByTestId('clear-button')

        fireEvent.press(clearBtn)

        expect(input.props.value).toBe('')
    })

    it('switches tabs correctly', () => {
        const { getByText } = render(<SearchBar {...defaultProps} />)

        fireEvent.press(getByText('Tab 2'))

        expect(mockSetActiveTab).toHaveBeenCalledWith(2)
    })
})
