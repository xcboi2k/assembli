import React from 'react'
import { render } from '@testing-library/react-native'
import TaskItem from '@/components/shared/dashboard/TaskItem'

describe('TaskItem', () => {
    it('renders title correctly', () => {
        const { getByText } = render(
            <TaskItem title="DRONE_FIRMWARE" tag="BETA-4" active />
        )

        expect(getByText('DRONE_FIRMWARE')).toBeTruthy()
    })

    it('renders tag correctly', () => {
        const { getByText } = render(
            <TaskItem title="DRONE_FIRMWARE" tag="BETA-4" active />
        )

        expect(getByText('BETA-4')).toBeTruthy()
    })

    it('renders both title and tag together', () => {
        const { getByText } = render(
            <TaskItem title="SANDINI_TASK" tag="ALPHA-1" active={false} />
        )

        expect(getByText('SANDINI_TASK')).toBeTruthy()
        expect(getByText('ALPHA-1')).toBeTruthy()
    })

    it('renders without crashing when active is true', () => {
        render(<TaskItem title="ACTIVE_TASK" tag="TEST" active />)
    })

    it('renders without crashing when active is false', () => {
        render(<TaskItem title="INACTIVE_TASK" tag="TEST" active={false} />)
    })
})
