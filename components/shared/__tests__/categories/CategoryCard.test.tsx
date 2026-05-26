import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import CategoryCard from '@/components/shared/categories/CategoryCard'

describe('CategoryCard', () => {
    const mockItem = {
        id: 'CAT_001',
        name: 'GUNPLA',
        description: 'Model kits from Bandai',
        is_seeded: false,
    }

    it('renders category info correctly', () => {
        const { getByText } = render(<CategoryCard item={mockItem} />)

        expect(getByText('ID_CAT_001')).toBeTruthy()
        expect(getByText('GUNPLA')).toBeTruthy()
        expect(getByText('Model kits from Bandai')).toBeTruthy()
    })

    it('shows edit and delete buttons when item is not seeded', () => {
        const { getByTestId } = render(
            <CategoryCard
                item={mockItem}
                onEdit={() => {}}
                onDelete={() => {}}
            />
        )

        const editButton = getByTestId('edit-button')
        const deleteButton = getByTestId('delete-button')

        expect(editButton).toBeTruthy()
        expect(deleteButton).toBeTruthy()
    })

    it('does NOT show edit/delete buttons when item is seeded', () => {
        const seededItem = {
            ...mockItem,
            is_seeded: true,
        }

        const { queryByTestId } = render(<CategoryCard item={seededItem} />)

        expect(queryByTestId('edit-button')).toBeNull()
        expect(queryByTestId('delete-button')).toBeNull()
    })

    it('calls onEdit when edit button is pressed', () => {
        const onEdit = jest.fn()

        const { getByTestId } = render(
            <CategoryCard item={mockItem} onEdit={onEdit} />
        )

        fireEvent.press(getByTestId('edit-button'))
        expect(onEdit).toHaveBeenCalledTimes(1)
    })

    it('calls onDelete when delete button is pressed', () => {
        const onDelete = jest.fn()

        const { getByTestId } = render(
            <CategoryCard item={mockItem} onDelete={onDelete} />
        )

        fireEvent.press(getByTestId('delete-button'))
        expect(onDelete).toHaveBeenCalledTimes(1)
    })
})
