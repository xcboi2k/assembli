import { render, fireEvent } from '@testing-library/react-native'
import TaskAddScreen from '../../collections/TaskAddScreen'

/**
 * MOCKS
 */

const mockAddTasksWithSubtasks = jest.fn()
const mockNavigate = jest.fn()

/* navigation */
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
}))

/* loader store */
jest.mock('@/stores/LoaderStore', () => ({
    __esModule: true,
    default: (selector: any) =>
        selector({
            isLoading: false,
        }),
}))

/* API hook */
jest.mock('@/hooks/main/useAddTasksWithSubTasks', () => ({
    __esModule: true,
    default: () => ({
        addTasksWithSubtasks: mockAddTasksWithSubtasks,
    }),
}))

/**
 * TEST SUITE
 */
describe('TaskAddScreen', () => {
    const route = {
        params: 1,
    }

    const navigation = {
        navigate: mockNavigate,
    }

    /**
     * -------------------------
     * RENDERING
     * -------------------------
     */
    it('renders empty state initially', () => {
        const { getByText } = render(
            <TaskAddScreen route={route} navigation={navigation} />
        )

        expect(getByText('NO TASKS CONFIGURED')).toBeOnTheScreen()
        expect(getByText('ADD TASK')).toBeOnTheScreen()
    })

    /**
     * -------------------------
     * ADD TASK
     * -------------------------
     */
    it('adds a new task when ADD TASK is pressed', () => {
        const { getByText, getAllByPlaceholderText } = render(
            <TaskAddScreen route={route} navigation={navigation} />
        )

        fireEvent.press(getByText('ADD TASK'))

        // after adding task, input appears
        expect(getAllByPlaceholderText('TASK 1').length).toBeGreaterThan(0)
    })

    /**
     * -------------------------
     * ADD SUBTASK
     * -------------------------
     */
    it('adds subtask to a task', () => {
        const { getByText } = render(
            <TaskAddScreen route={route} navigation={navigation} />
        )

        fireEvent.press(getByText('ADD TASK'))

        fireEvent.press(getByText('ADD SUBTASK'))

        expect(getByText('SUBTASK 1')).toBeOnTheScreen()
    })

    /**
     * -------------------------
     * REMOVE TASK
     * -------------------------
     */
    it('removes task when REMOVE TASK is pressed', () => {
        const { getByText, queryByText } = render(
            <TaskAddScreen route={route} navigation={navigation} />
        )

        fireEvent.press(getByText('ADD TASK'))
        fireEvent.press(getByText('REMOVE TASK'))

        expect(queryByText('TASK 1')).toBeNull()
    })

    /**
     * -------------------------
     * SUBMIT PAYLOAD
     * -------------------------
     */
    it('submits correct payload', () => {
        const { getByText, getAllByPlaceholderText } = render(
            <TaskAddScreen route={route} navigation={navigation} />
        )

        fireEvent.press(getByText('ADD TASK'))

        const taskInput = getAllByPlaceholderText('TASK 1')[0]
        fireEvent.changeText(taskInput, 'Build Gundam')

        fireEvent.press(getByText('ADD SUBTASK'))

        const subtaskInput = getAllByPlaceholderText('SUBTASK 1')[0]
        fireEvent.changeText(subtaskInput, 'Paint armor')

        fireEvent.press(getByText('COMMIT'))

        expect(mockAddTasksWithSubtasks).toHaveBeenCalledWith(
            expect.objectContaining({
                collection_id: 1,
                tasks: [
                    {
                        title: 'Build Gundam',
                        subtasks: [
                            {
                                title: 'Paint armor',
                            },
                        ],
                    },
                ],
            }),
            expect.any(Function)
        )
    })

    /**
     * -------------------------
     * NAVIGATION BACK
     * -------------------------
     */
    it('navigates back to details screen', () => {
        const { getByText } = render(
            <TaskAddScreen route={route} navigation={navigation} />
        )

        fireEvent.press(getByText('ABORT'))

        expect(mockNavigate).toHaveBeenCalledWith('CollectionDetails', 1)
    })
})
