import { useState } from 'react'
import * as Sentry from '@sentry/react-native'

import LoaderStore from '@/stores/LoaderStore'
import { changePassword } from '@/backend/auth'
import UserStore from '@/stores/UserStore'
import { useToast } from '@/providers/ToastProvider'

export const useChangePassword = () => {
    const startLoading = LoaderStore((state) => state.startLoading)
    const stopLoading = LoaderStore((state) => state.stopLoading)
    const { showToast } = useToast()

    const user = UserStore((state) => state.user)
    const setLoggedOut = UserStore((state) => state.setLoggedOut)

    const mutate = async (values) => {
        startLoading()
        try {
            const res = await changePassword(
                user.id,
                values.oldPassword,
                values.newPassword
            )

            if (!res.success) {
                stopLoading()
                showToast(res.message, 'error')
                Sentry.captureException(
                    `Failed to change password in ${user.username}. ${res.message}`
                )
                return
            }

            showToast('Successfully changed password', 'success')
            stopLoading()
            setLoggedOut()
        } catch (error) {
            stopLoading()
            await new Promise((resolve) => setTimeout(resolve, 100))
            showToast(`Service not available right now.`, 'error')
            Sentry.captureException(
                `Failed to change password in ${user.username}. Service not available right now. ${error}`
            )
        }
    }

    return {
        changePassword: mutate,
    }
}
