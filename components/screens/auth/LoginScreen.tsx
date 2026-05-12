import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useFormik } from 'formik'
import React, { useEffect, useRef } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import * as Yup from 'yup'

import ButtonText from '@/components/shared/ButtonText'
import CustomTextInput from '@/components/shared/CustomTextInput'
import LoginHeader from '@/components/shared/login/LoginHeader'
import { INITIAL_VALUES } from '@/constants/formvalues'
import useLoginUser from '@/hooks/auth/useLoginUser'
import type { AuthStackParamList } from '@/navigation/types'
import CustomLoader from '@/components/shared/CustomLoader'
import LoaderStore from '@/stores/LoaderStore'

export default function LoginScreen() {
    const navigation =
        useNavigation<NativeStackNavigationProp<AuthStackParamList, 'Login'>>()

    const isLoading = LoaderStore((state) => state.isLoading)

    const submitRef = useRef(null)

    // Handles signing up
    const { loginUser } = useLoginUser()

    // Assigns sign up function to formik upon initialization
    useEffect(() => {
        submitRef.current = loginUser
    }, [loginUser])

    const formik = useFormik({
        initialValues: INITIAL_VALUES.SIGN_IN,
        // Pattern to resolve circular dependency
        onSubmit: async (values, actions) => {
            console.log('FORM SUBMITTED')
            console.log(values)

            try {
                await loginUser(values, actions)
            } catch (err) {
                console.log(err)
            } finally {
                actions.setSubmitting(false)
            }
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Username is required'),
            password: Yup.string().required('Password is required'),
        }),
    })

    return (
        <>
            <LoginHeader />
            <View className="flex-1 bg-background-100 p-4">
                <View className="w-full p-4 bg-background-200 border border-[#414755] mt-4">
                    <View className="mb-6">
                        <Text className="font-headingRegular text-[16px] text-primary-200 mb-3">
                            SECURE_INTERFACE
                        </Text>
                        <Text className="font-headingRegular text-[16px] text-primary-200 ">
                            TERMINAL_LOGIN
                        </Text>
                    </View>
                    <View className="w-full border-t border-[#414755] mb-6" />
                    <View className="w-full bg-[#0F172A] border border-red-500 -4 flex-row items-start p-4 mb-6">
                        {/* ICON */}
                        <Feather
                            name="alert-triangle"
                            size={18}
                            color="#EF4444"
                            style={{ marginTop: 2, marginRight: 8 }}
                        />

                        {/* TEXT CONTENT */}
                        <View className="flex-1">
                            <Text className="text-[#EF4444] text-[16px] tracking-widest">
                                RESTRICTED_ACCESS
                            </Text>

                            <Text className="text-[#FFDAD6] font-body text-[16px] mt-1 leading-5">
                                Unauthorised access attempts are logged and
                                reported to central security command.
                            </Text>
                        </View>
                    </View>

                    <CustomTextInput
                        inputProps={{
                            placeholder: 'IDENTIFICATION_STRING',
                            keyboardType: 'email-address',
                            onChangeText: formik.handleChange('username'),
                            value: formik.values.username,
                            autoCapitalize: 'none',
                        }}
                        customLabel="OPERATOR_ID"
                        variant="name"
                        padding="25px"
                        hasIcon={true}
                        rightLabel="REQUIRED_FIELD"
                        hasStatus
                        statusText={
                            formik.errors.username &&
                            formik.touched.username &&
                            formik.errors.username
                        }
                    />
                    <CustomTextInput
                        inputProps={{
                            placeholder: '••••••••••••',
                            keyboardType: 'email-address',
                            onChangeText: formik.handleChange('password'),
                            value: formik.values.password,
                            autoCapitalize: 'none',
                        }}
                        customLabel="ACCESS_CODE"
                        variant="password"
                        padding="25px"
                        hasIcon={true}
                        rightLabel="ENCRYPTED_INPUT"
                        hasStatus
                        statusText={
                            formik.errors.password &&
                            formik.touched.password &&
                            formik.errors.password
                        }
                    />
                    <View className="w-full">
                        <ButtonText
                            title="A U T H E N T I C A T E"
                            onPress={() => formik.handleSubmit()}
                        />
                    </View>
                    {/* TOP LABEL */}
                    <View className="items-center py-3 mb-6">
                        <TouchableOpacity
                            className="mt-3"
                            onPress={() => navigation.navigate('SignUp')}
                        >
                            <Text className="font-headingRegular text-[11px] text-primary-400 tracking-widest">
                                NEW_OPERATOR_REGISTRATION
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* BOTTOM GRID */}
                    <View className="flex-row">
                        {/* LEFT */}
                        <View className="flex-1 items-center py-4 border-r border-blue-500/20">
                            <Text className="font-headingRegular text-[9px] text-gray-400 tracking-widest mb-2">
                                SYSTEM_STATUS
                            </Text>

                            <View className="flex-row items-center">
                                <View className="w-2 h-2 rounded-full bg-orange-400 mr-2" />
                                <Text className="font-body text-[10px] text-gray-200">
                                    OPTIMAL
                                </Text>
                            </View>
                        </View>

                        {/* RIGHT */}
                        <View className="flex-1 items-center py-4">
                            <Text className="text-[10px] text-gray-400 tracking-widest mb-1">
                                ENCRYPTION
                            </Text>

                            <Text className="text-xs text-gray-200">
                                AES_256_GCM
                            </Text>
                        </View>
                    </View>
                </View>
                <CustomLoader visible={isLoading} />
            </View>
        </>
    )
}
