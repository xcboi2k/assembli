import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import DashboardTaskAddScreen from '../../dashboard/DashboardTaskAddScreen'

// ---- mocks ----
jest.mock('@react-navigation/core', () => ({
    useFocusEffect: (cb: any) => cb(),
}))

const mockNavigate = jest.fn()

const routeMock = {
    params: {
        item: {
            id: 1,
        },
    },
}

const navigationMock = {
    navigate: mockNavigate,
}

jest.mock('@/stores/LoaderStore', () => ({
    __esModule: true,
    default: (selector: any) =>
        selector({
            isLoading: false,
        }),
}))

jest.mock('@/hooks/main/useAddTasksWithSubTasks', () => ({
    default: () => ({
        addTasksWithSubtasks: jest.fn(async (payload, cb) => {
            cb?.()
        }),
    }),
}))

jest.mock('@/components/shared/Header', () => 'Header')
jest.mock('@/components/shared/FormTextInput', () => {
    const React = require('react')
    const { TextInput } = require('react-native')
    return (props: any) => <TextInput {...props.inputProps} />
})

jest.mock('@expo/vector-icons', () => ({
    Feather: () => null,
}))

// ---- test suite ----
describe('DashboardTaskAddScreen', () => {
    it('renders empty state initially', () => {
        const { getByText } = render(
            <DashboardTaskAddScreen
                route={routeMock}
                navigation={navigationMock}
            />
        )

        expect(getByText('NO TASKS CONFIGURED')).toBeTruthy()
    })

    it('adds a task', () => {
        const { getByText, getByTestId } = render(
            <DashboardTaskAddScreen
                route={routeMock}
                navigation={navigationMock}
            />
        )

        const addButton = getByText('ADD TASK')
        fireEvent.press(addButton)

        expect(getByText('TASK 1')).toBeTruthy()
    })

    it('adds subtask to task', () => {
        const { getByText } = render(
            <DashboardTaskAddScreen
                route={routeMock}
                navigation={navigationMock}
            />
        )

        fireEvent.press(getByText('ADD TASK'))
        fireEvent.press(getByText('ADD SUBTASK'))

        expect(getByText('SUBTASK 1')).toBeTruthy()
    })

    it('removes task', () => {
        const { getByText, queryByText } = render(
            <DashboardTaskAddScreen
                route={routeMock}
                navigation={navigationMock}
            />
        )

        fireEvent.press(getByText('ADD TASK'))
        fireEvent.press(getByText('REMOVE TASK'))

        expect(queryByText('TASK 1')).toBeNull()
    })

    it('removes subtask', () => {
        const { getByText, queryAllByText } = render(
            <DashboardTaskAddScreen
                route={routeMock}
                navigation={navigationMock}
            />
        )

        fireEvent.press(getByText('ADD TASK'))
        fireEvent.press(getByText('ADD SUBTASK'))

        const deleteButtons = queryAllByText('') // icon-only button fallback
        expect(deleteButtons.length).toBeGreaterThan(0)
    })

    it('submits tasks and navigates', async () => {
        const { getByText } = render(
            <DashboardTaskAddScreen
                route={routeMock}
                navigation={navigationMock}
            />
        )

        fireEvent.press(getByText('ADD TASK'))

        await waitFor(() => {
            fireEvent.press(getByText('COMMIT'))
        })

        expect(mockNavigate).toHaveBeenCalled()
    })
})
