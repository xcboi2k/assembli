import React from 'react'
import { render } from '@testing-library/react-native'
import CustomDropdown from '@/components/shared/CustomDropdown'

// Mock react-native-dropdown-select-list
jest.mock('react-native-dropdown-select-list', () => {
    const React = require('react')
    const { Text, TouchableOpacity, View } = require('react-native')

    return {
        SelectList: ({ setSelected, data }: any) => (
            <View>
                {data?.map((item: any, index: number) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => setSelected(item.key)}
                    >
                        <Text>{item.value || item.key}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        ),
    }
})

describe('CustomDropdown', () => {
    const mockData = [
        { key: 'A', value: 'Option A' },
        { key: 'B', value: 'Option B' },
    ]

    it('renders label correctly', () => {
        const { getByText } = render(
            <CustomDropdown
                label="Category"
                selectedValue={null}
                onValueChange={jest.fn()}
                data={mockData}
            />
        )

        expect(getByText('Category')).toBeTruthy()
    })

    it('renders dropdown options', () => {
        const { getByText } = render(
            <CustomDropdown
                label="Category"
                selectedValue={null}
                onValueChange={jest.fn()}
                data={mockData}
            />
        )

        expect(getByText('Option A')).toBeTruthy()
        expect(getByText('Option B')).toBeTruthy()
    })

    it('calls onValueChange when option is selected', () => {
        const onValueChange = jest.fn()

        const { getByText } = render(
            <CustomDropdown
                label="Category"
                selectedValue={null}
                onValueChange={onValueChange}
                data={mockData}
            />
        )

        getByText('Option A').props.onPress()

        expect(onValueChange).toHaveBeenCalledWith('A')
    })

    it('renders error message when provided', () => {
        const { getByText } = render(
            <CustomDropdown
                label="Category"
                selectedValue={null}
                onValueChange={jest.fn()}
                data={mockData}
                errorMessage="Required field"
            />
        )

        expect(getByText('Required field')).toBeTruthy()
    })
})
