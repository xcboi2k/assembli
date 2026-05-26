import React from 'react'
import { render } from '@testing-library/react-native'
import LoginHeader from '@/components/shared/login/LoginHeader'

describe('LoginHeader', () => {
    it('renders app name correctly', () => {
        const { getByText } = render(<LoginHeader />)

        expect(getByText('ASSEMBLI')).toBeTruthy()
    })

    it('renders version text correctly', () => {
        const { getByText } = render(<LoginHeader />)

        expect(getByText('V.0.0.1_DEV')).toBeTruthy()
    })

    it('renders without crashing', () => {
        render(<LoginHeader />)
    })
})
