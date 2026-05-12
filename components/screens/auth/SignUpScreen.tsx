import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import Checkbox from 'expo-checkbox'
import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import SignUpTextInput from '@/components/shared/signup/SignUpTextInput'
import ButtonText from '@/components/shared/ButtonText'
import type { AuthStackParamList } from '@/navigation/types'
import LoginHeader from '@/components/shared/login/LoginHeader'
import useSignUpUser from '@/hooks/auth/useSignUpUser'
import { INITIAL_VALUES } from '@/constants/formvalues'
import CustomLoader from '@/components/shared/CustomLoader'
import LoaderStore from '@/stores/LoaderStore'

export default function SignUpScreen() {
    const navigation =
        useNavigation<NativeStackNavigationProp<AuthStackParamList, 'SignUp'>>()

    const isLoading = LoaderStore((state) => state.isLoading)

    const [isChecked, setIsChecked] = useState(false)

    const submitRef = useRef(null)

    // Handles signing up
    const { signUpUser } = useSignUpUser()

    // Assigns sign up function to formik upon initialization
    useEffect(() => {
        submitRef.current = signUpUser
    }, [signUpUser])

    const formik = useFormik({
        initialValues: INITIAL_VALUES.CREATE_ACCOUNT,
        // Pattern to resolve circular dependency
        onSubmit: async (values, actions) => {
            console.log('FORM SUBMITTED')
            console.log(values)

            try {
                await signUpUser(values, actions, navigation.navigate('Login'))
            } catch (err) {
                console.log(err)
            } finally {
                actions.setSubmitting(false)
            }
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Username is required'),
            password: Yup.string().required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Please confirm your password'),
        }),
    })
    return (
        <>
            <LoginHeader />
            <View className="flex-1 bg-background-100 p-4">
                <ScrollView>
                    <View className="w-full px-4 py-6 bg-background-200 border border-[#414755] mt-4">
                        <Text className="font-headingBold text-[12px] text-primary-200">
                            SYSTEM_AUTH
                        </Text>
                        <Text className="font-headingBold text-[30px] text-neutral-100 ">
                            OPERATOR_REGISTRATION
                        </Text>
                    </View>
                    <View className="w-full p-4 bg-[#010F1F] border border-[#414755]">
                        <SignUpTextInput
                            inputProps={{
                                placeholder: 'Enter username',
                                keyboardType: 'email-address',
                                onChangeText: formik.handleChange('username'),
                                value: formik.values.username,
                                autoCapitalize: 'none',
                            }}
                            label="USERNAME"
                            variant="username"
                            hasStatus
                            statusText={
                                formik.errors.username &&
                                formik.touched.username &&
                                formik.errors.username
                            }
                        />
                        <SignUpTextInput
                            inputProps={{
                                placeholder: 'Enter password',
                                keyboardType: 'email-address',
                                onChangeText: formik.handleChange('password'),
                                value: formik.values.password,
                                autoCapitalize: 'none',
                            }}
                            label="PASSWORD"
                            variant="password"
                            secureTextEntry
                            hasStatus
                            statusText={
                                formik.errors.password &&
                                formik.touched.password &&
                                formik.errors.password
                            }
                        />
                        <SignUpTextInput
                            inputProps={{
                                placeholder: 'Enter password',
                                keyboardType: 'email-address',
                                onChangeText:
                                    formik.handleChange('confirmPassword'),
                                value: formik.values.confirmPassword,
                                autoCapitalize: 'none',
                            }}
                            label="CONFIRM PASSWORD"
                            variant="password"
                            secureTextEntry
                            hasStatus
                            statusText={
                                formik.errors.confirmPassword &&
                                formik.touched.confirmPassword &&
                                formik.errors.confirmPassword
                            }
                        />
                        <View className="flex-row items-start mt-3 mb-6">
                            {/* CHECKBOX */}
                            <Checkbox
                                value={isChecked}
                                onValueChange={() =>
                                    setIsChecked((prev) => !prev)
                                }
                                color={isChecked ? '#007AFF' : '#1A1C1E'}
                            />

                            {/* TEXT */}
                            <View className="ml-3 flex-1">
                                <Text className="font-headingRegular text-neutral-100 text-[13px]">
                                    AGREE_TO_SYSTEM_PROTOCOLS
                                </Text>
                                <Text className="text-body text-[#8B90A0] text-[12px]">
                                    I confirm that I have reviewed Assembli
                                    guidelines and data privacy terms.
                                </Text>
                            </View>
                        </View>

                        <View className="w-full">
                            <ButtonText
                                title="REGISTER_OPERATOR"
                                isBold={true}
                                onPress={() => formik.handleSubmit()}
                                disabled={!isChecked}
                            />
                        </View>

                        <View className="w-full border-t border-[#414755] mb-6" />

                        <View className="w-full flex flex-row justify-center">
                            <Text className="text-[13px] text-body text-[#8B90A0] mr-[5px]">
                                Already have an account?
                            </Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Login')}
                            >
                                <Text className="text-[13px] text-neutral-200 font-headingRegular">
                                    Log In
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <CustomLoader visible={isLoading} />
            </View>
        </>
    )
}
