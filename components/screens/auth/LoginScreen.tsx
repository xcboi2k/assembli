import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Feather } from '@expo/vector-icons'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import CustomTextInput from '@/components/shared/CustomTextInput'
import ButtonText from '@/components/shared/ButtonText'
import LoginHeader from '@/components/shared/login/LoginHeader'
import type { AuthStackParamList, RootStackParamList } from '@/navigation/types'

export default function LoginScreen() {
    const navigation =
        useNavigation<NativeStackNavigationProp<AuthStackParamList, 'Login'>>()

    const goToMain = () => {
        const root =
            navigation.getParent<NativeStackNavigationProp<RootStackParamList>>()
        root?.navigate('Main')
    }

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
                            // onChangeText: formik.handleChange("email"),
                            // value: formik.values.email,
                            autoCapitalize: 'none',
                        }}
                        customLabel="OPERATOR_ID"
                        variant="name"
                        padding="25px"
                        hasIcon={true}
                        rightLabel="REQUIRED_FIELD"
                    />
                    <CustomTextInput
                        inputProps={{
                            placeholder: '••••••••••••',
                            keyboardType: 'email-address',
                            // onChangeText: formik.handleChange("email"),
                            // value: formik.values.email,
                            autoCapitalize: 'none',
                        }}
                        customLabel="ACCESS_CODE"
                        variant="password"
                        padding="25px"
                        hasIcon={true}
                        rightLabel="ENCRYPTED_INPUT"
                    />
                    <View className="w-full">
                        <ButtonText
                            title="A U T H E N T I C A T E"
                            onPress={goToMain}
                        />
                    </View>
                    {/* TOP LABEL */}
                    <View className="items-center py-3 mb-6">
                        <Text className="font-headingRegular text-[10px] text-[#8B90A0] tracking-widest">
                            FORGOT_CREDENTIALS
                        </Text>
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
            </View>
        </>
    )
}
