import * as Sentry from '@sentry/react-native'

import LoaderStore from '@/stores/LoaderStore'

// import { cleanAuthError } from '@/utils/errors/cleanError'
import UserStore from '@/stores/UserStore'
import { useToast } from '@/providers/ToastProvider'
import { login } from '@/backend/auth'

export default function useLoginUser() {
    const startLoading = LoaderStore((state) => state.startLoading)
    const stopLoading = LoaderStore((state) => state.stopLoading)

    const setLoggedIn = UserStore((state) => state.setLoggedIn)
    const setUser = UserStore((state) => state.setUser)

    const { showToast } = useToast()

    const loginUser = async (values, { resetForm }) => {
        startLoading()
        try {
            const response = await login(values.username, values.password)

            console.log('response:', response)
            if (!response.success) {
                stopLoading()
                showToast(response.message, 'error')
                Sentry.captureException(
                    `Failed to login user in ${values.username}. ${response.message}`
                )
            } else {
                showToast('Successfully logged in', 'success')
                stopLoading()
                setUser(response.user)
                setLoggedIn()
            }
        } catch (error) {
            //setting state of user feedback stores to initialize user feedback components
            stopLoading()
            await new Promise((resolve) => setTimeout(resolve, 100))
            showToast(`Service not available right now.`, 'error')
            Sentry.captureException(
                `Failed to login user in ${values.username}. Service not available right now. ${error}`
            )
        }
    }

    return { loginUser }
}
