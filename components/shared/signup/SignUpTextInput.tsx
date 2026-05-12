import React, { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    TextInputProps,
} from 'react-native'
import Feather from '@expo/vector-icons/Feather'
import Entypo from '@expo/vector-icons/Entypo'

type Props = {
    label?: string
    value?: string
    onChangeText?: (text: string) => void
    placeholder?: string
    variant?: 'email' | 'password' | 'name' | 'username'
    rightLabel?: string
    onRightLabelPress?: () => void
    secureTextEntry?: boolean
    inputProps?: TextInputProps // Assuming you want to use TextInputProps from react-native
    hasStatus?: boolean
    statusText?: any
}

const iconMap = {
    email: 'mail',
    password: 'lock',
    name: 'user',
    username: 'at-sign',
}

export default function SignUpTextInput({
    label,
    value,
    onChangeText,
    placeholder,
    variant = 'email',
    rightLabel,
    onRightLabelPress,
    secureTextEntry,
    inputProps,
    hasStatus = false,
    statusText,
}: Props) {
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible)
    }

    return (
        <View className="w-full mb-3">
            {/* TOP: LABEL + ICON BOX */}
            {label && (
                <View className="flex-row items-center justify-between border border-[#414755] px-3 py-2 bg-background-200">
                    {/* LEFT */}
                    <View className="flex-row items-center">
                        <Text className="text-[13px] font-headingBold text-[#c1c6d7]">
                            {label}
                        </Text>
                    </View>

                    <Feather
                        name={iconMap[variant]}
                        size={16}
                        color="#8B90A0"
                    />
                </View>
            )}

            {/* BOTTOM: INPUT BOX */}
            <View className="flex-row items-center border border-[#414755] border-t-0 px-3 py-3 bg-tertiary-500">
                <TextInput
                    {...inputProps}
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={secureTextEntry}
                    className="text-body text-[16px] text-[#8B90A0]"
                />
                {variant === 'password' && (
                    <View className="items-center ml-auto">
                        <TouchableOpacity onPress={togglePasswordVisibility}>
                            {isPasswordVisible ? (
                                <Entypo
                                    name="eye"
                                    size={24}
                                    color={'#8B90A0'}
                                />
                            ) : (
                                <Entypo
                                    name="eye-with-line"
                                    size={24}
                                    color={'#8B90A0'}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            {hasStatus === true && (
                <View className="w-full flex-row items-center">
                    {statusText && (
                        <Text className="text-[10px] font-body text-red-500">
                            {statusText}
                        </Text>
                    )}
                </View>
            )}
        </View>
    )
}
