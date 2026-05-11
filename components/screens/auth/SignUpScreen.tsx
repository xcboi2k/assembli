import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import Checkbox from 'expo-checkbox'
import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import SignUpTextInput from '@/components/shared/signup/SignUpTextInput'
import ButtonText from '@/components/shared/ButtonText'
import type { AuthStackParamList } from '@/navigation/types'

export default function SignUpScreen() {
    const navigation =
        useNavigation<NativeStackNavigationProp<AuthStackParamList, 'SignUp'>>()
    const [isChecked, setIsChecked] = useState(false)
    return (
        <View className="flex-1 bg-background-100 p-4">
            <View className="w-full px-4 py-6 bg-background-200 border border-[#414755] mt-8">
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
                        placeholder: 'Enter name',
                        keyboardType: 'email-address',
                        // onChangeText: formik.handleChange("email"),
                        // value: formik.values.email,
                        autoCapitalize: 'none',
                    }}
                    label="FULL_NAME"
                    variant="name"
                />
                <SignUpTextInput
                    inputProps={{
                        placeholder: 'Enter email',
                        keyboardType: 'email-address',
                        // onChangeText: formik.handleChange("email"),
                        // value: formik.values.email,
                        autoCapitalize: 'none',
                    }}
                    label="EMAIL_ADDRESS"
                    variant="email"
                />
                <SignUpTextInput
                    inputProps={{
                        placeholder: 'Enter username',
                        keyboardType: 'email-address',
                        // onChangeText: formik.handleChange("email"),
                        // value: formik.values.email,
                        autoCapitalize: 'none',
                    }}
                    label="USERNAME"
                    variant="username"
                />
                <SignUpTextInput
                    inputProps={{
                        placeholder: 'Enter password',
                        keyboardType: 'email-address',
                        // onChangeText: formik.handleChange("email"),
                        // value: formik.values.email,
                        autoCapitalize: 'none',
                    }}
                    label="PASSWORD"
                    variant="password"
                    secureTextEntry
                />
                <View className="flex-row items-start mt-3 mb-6">
                    {/* CHECKBOX */}
                    <Checkbox
                        value={isChecked}
                        onValueChange={() => setIsChecked((prev) => !prev)}
                        color={isChecked ? '#007AFF' : '#1A1C1E'}
                    />

                    {/* TEXT */}
                    <View className="ml-3 flex-1">
                        <Text className="font-headingRegular text-neutral-100 text-[13px]">
                            AGREE_TO_SYSTEM_PROTOCOLS
                        </Text>
                        <Text className="text-body text-[#8B90A0] text-[12px]">
                            I confirm that I have reviewed the telemetry
                            guidelines and data privacy terms.
                        </Text>
                    </View>
                </View>

                <View className="w-full">
                    <ButtonText
                        title="REGISTER_OPERATOR"
                        isBold={true}
                        onPress={() => navigation.navigate('Login')}
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
        </View>
    )
}
