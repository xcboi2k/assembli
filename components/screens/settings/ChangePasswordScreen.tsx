import { useFormik } from 'formik'
import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import * as Yup from 'yup'

import ButtonText from '@/components/shared/ButtonText'
import CustomLoader from '@/components/shared/CustomLoader'
import FormTextInput from '@/components/shared/FormTextInput'
import Header from '@/components/shared/Header'
import { INITIAL_VALUES } from '@/constants/formvalues'
import { useChangePassword } from '@/hooks/settings/useChangePassword'
import LoaderStore from '@/stores/LoaderStore'

export default function ChangePasswordScreen() {
    const isLoading = LoaderStore((state) => state.isLoading)
    const { changePassword } = useChangePassword()

    const formik = useFormik({
        initialValues: INITIAL_VALUES.CHANGE_PASSWORD,
        // Pattern to resolve circular dependency
        onSubmit: async (values, actions) => {
            console.log('FORM SUBMITTED')
            console.log(values)

            try {
                await changePassword(values)
            } catch (err) {
                console.log(err)
            } finally {
                actions.setSubmitting(false)
            }
        },
        validationSchema: Yup.object({
            oldPassword: Yup.string().required('Password is required'),
            newPassword: Yup.string().required('New password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
                .required('Please confirm your new password'),
        }),
    })
    return (
        <>
            <Header title="" variant="settings" />
            <View className="flex-1 bg-[#0F1113] p-4">
                <ScrollView>
                    <View className="border border-[#1E293B] bg-[#1A1C1E] mb-4">
                        {/* HEADER */}
                        <View className="p-4 border-b-[#1E293B] bg-[#273647]/30 flex-row justify-between">
                            <Text className="text-[16px] text-white tracking-widest font-headingRegular">
                                PASSWORD_OVERRIDE
                            </Text>
                        </View>

                        <View className="p-4">
                            <FormTextInput
                                label="OLD_PASSWORD"
                                inputProps={{
                                    placeholder: '**********',
                                    onChangeText:
                                        formik.handleChange('oldPassword'),
                                    value: formik.values.oldPassword,
                                }}
                                hasStatus={true}
                                statusText={
                                    formik.errors.oldPassword &&
                                    formik.touched.oldPassword &&
                                    formik.errors.oldPassword
                                }
                            />
                            <FormTextInput
                                label="NEW_PASSWORD"
                                inputProps={{
                                    placeholder: '**********',
                                    onChangeText:
                                        formik.handleChange('newPassword'),
                                    value: formik.values.newPassword,
                                }}
                                hasStatus={true}
                                statusText={
                                    formik.errors.newPassword &&
                                    formik.touched.newPassword &&
                                    formik.errors.newPassword
                                }
                            />
                            <FormTextInput
                                label="CONFIRM_PASSWORD"
                                inputProps={{
                                    placeholder: '**********',
                                    onChangeText:
                                        formik.handleChange('confirmPassword'),
                                    value: formik.values.confirmPassword,
                                }}
                                hasStatus={true}
                                statusText={
                                    formik.errors.confirmPassword &&
                                    formik.touched.confirmPassword &&
                                    formik.errors.confirmPassword
                                }
                            />
                            <ButtonText
                                title="UPDATE_CREDENTIALS"
                                isBold
                                onPress={formik.handleSubmit}
                            />
                        </View>
                    </View>
                </ScrollView>
                <CustomLoader visible={isLoading} />
            </View>
        </>
    )
}
