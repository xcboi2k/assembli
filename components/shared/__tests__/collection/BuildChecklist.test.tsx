import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import BuildChecklist from '@/components/shared/collection/BuildChecklist'

// Mock icon libs (prevents native issues)
jest.mock('@expo/vector-icons', () => ({
    Feather: () => null,
}))
jest.mock('@expo/vector-icons/MaterialCommunityIcons', () => () => null)

// Mock hooks
const updateTaskNameRecord = jest.fn()
const deleteTask = jest.fn()

const updateSubtaskNameRecord = jest.fn()
const deleteSubtask = jest.fn()
const updateSubtaskStatusRecord = jest.fn()

jest.mock('@/hooks/main/tasks/useUpdateTask', () => () => ({
    updateTaskNameRecord,
    updateTaskStatusRecord: jest.fn(),
}))

jest.mock('@/hooks/main/tasks/useDeleteTask', () => () => ({
    deleteTask,
}))

jest.mock('@/hooks/main/subtasks/useUpdateSubtask', () => () => ({
    updateSubtaskNameRecord,
    updateSubtaskStatusRecord,
}))

jest.mock('@/hooks/main/subtasks/useDeleteSubtask', () => () => ({
    deleteSubtask,
}))

describe('BuildChecklist', () => {
    const mockItems = [
        {
            id: 1,
            name: 'Task A',
            status: 'pending',
            subtasks: [
                { id: 10, name: 'Sub A1', status: 'PENDING' },
                { id: 11, name: 'Sub A2', status: 'COMPLETED' },
            ],
        },
    ]

    const baseProps = {
        collectionId: 100,
        items: mockItems,
        updateRefreshKey: jest.fn(),
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders task and subtasks', () => {
        const { getByText } = render(<BuildChecklist {...baseProps} />)

        expect(getByText('Task A')).toBeTruthy()
        expect(getByText('Sub A1')).toBeTruthy()
        expect(getByText('Sub A2')).toBeTruthy()
    })

    it('toggles edit mode', () => {
        const { getByTestId, getByText } = render(
            <BuildChecklist {...baseProps} />
        )

        // You should add testID to edit button for stability
        const editButton = getByTestId('toggle-edit')

        fireEvent.press(editButton)

        expect(getByText('Save')).toBeTruthy()
    })

    it('calls deleteTask when delete is pressed', () => {
        const { getByText, getByTestId } = render(
            <BuildChecklist {...baseProps} />
        )

        fireEvent.press(getByTestId('toggle-edit'))

        fireEvent.press(getByText('Delete'))

        expect(deleteTask).toHaveBeenCalled()
    })

    it('calls updateTaskNameRecord when saving task edit', () => {
        const { getByTestId, getByText } = render(
            <BuildChecklist {...baseProps} />
        )

        fireEvent.press(getByTestId('toggle-edit'))

        fireEvent.press(getByText('Edit'))

        fireEvent.changeText(getByTestId('task-input'), 'New Task Name')

        fireEvent.press(getByText('Save'))

        expect(updateTaskNameRecord).toHaveBeenCalled()
    })

    it('updates subtask status', () => {
        const { getByTestId, getByText } = render(
            <BuildChecklist {...baseProps} />
        )

        fireEvent.press(getByTestId('toggle-edit'))

        fireEvent.press(getByText('IN PROGRESS'))

        expect(updateSubtaskStatusRecord).toHaveBeenCalled()
    })
})
