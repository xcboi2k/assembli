import * as Sentry from '@sentry/react-native'

import LoaderStore from '@/stores/LoaderStore'
import { useToast } from '@/providers/ToastProvider'
import { register } from '@/backend/auth'

export default function useSignUpUser() {
    const startLoading = LoaderStore((state) => state.startLoading)
    const stopLoading = LoaderStore((state) => state.stopLoading)

    const { showToast } = useToast()

    const signUpUser = async (values, { resetForm }, goToNextScreen) => {
        console.log('sign up values:', values)
        startLoading()
        try {
            const response = await register(values.username, values.password)

            console.log('response:', response)
            if (!response.success) {
                stopLoading()
                showToast(response.message, 'error')
                Sentry.captureException(
                    `Failed to create user in ${values.username}. ${response.message}`
                )
            } else {
                showToast(
                    'Successfully created an account. Please login created account.',
                    'success'
                )
                stopLoading()
                resetForm
                goToNextScreen
            }
        } catch (error) {
            //setting state of user feedback stores to initialize user feedback components
            stopLoading()
            await new Promise((resolve) => setTimeout(resolve, 100))
            showToast(`Service not available right now.`, 'error')
            Sentry.captureException(
                `Failed to create user in ${values.username}. ${error}`
            )
        }
    }

    return { signUpUser }
}
