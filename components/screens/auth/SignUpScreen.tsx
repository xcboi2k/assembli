import SignUpTextInput from '@/components/shared/signup/SignUpTextInput'
import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Checkbox from 'expo-checkbox'
import ButtonText from '@/components/shared/ButtonText'

export default function SignUpScreen() {
    const [isChecked, setIsChecked] = useState(false)
    return (
        <View className="flex-1 bg-background-100 p-4">
            <View className="w-full px-4 py-6 bg-background-200 border border-[#414755] mt-8">
                <Text className="font-heading text-[12px] text-primary-200">
                    SYSTEM_AUTH
                </Text>
                <Text className="font-heading text-[30px] text-neutral-100 ">
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
                    label="EMAIL"
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
                <View className="flex-row items-start mb-6">
                    {/* CHECKBOX */}
                    <Checkbox
                        value={isChecked}
                        onValueChange={() => setIsChecked((prev) => !prev)}
                        color={isChecked ? '#007AFF' : '#1A1C1E'}
                    />

                    {/* TEXT */}
                    <View className="ml-3 flex-1">
                        <Text className="text-heading text-neutral-100 text-[11px]">
                            AGREE_TO_SYSTEM_PROTOCOLS
                        </Text>
                        <Text className="text-body text-[#8B90A0] text-[10px]">
                            I confirm that I have reviewed the telemetry
                            guidelines and data privacy terms.
                        </Text>
                    </View>
                </View>

                <View className="w-full">
                    <ButtonText title="REGISTER_OPERATOR" />
                </View>

                <View className="w-full border-t border-[#414755] mb-6" />

                <View className="w-full flex flex-row justify-center">
                    <Text className="text-[11px] text-body text-[#8B90A0] mr-[5px]">
                        Already have an account?
                    </Text>
                    <TouchableOpacity
                    // onPress={() => navigation.navigate('Login')}
                    >
                        <Text className="text-[11px] text-neutral-200 text-heading">
                            Log In
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
