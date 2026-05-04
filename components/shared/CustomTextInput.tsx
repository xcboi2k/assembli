import React, { useState } from 'react'
import {
    View,
    TextInput,
    Text,
    TextInputProps,
    TouchableOpacity,
} from 'react-native'
import Entypo from '@expo/vector-icons/Entypo'
import Feather from '@expo/vector-icons/Feather'

interface CustomTextInputProps {
    padding?: string
    marginBottom?: string
    customLabel?: string
    customLabelColor?: string
    inputProps?: TextInputProps // Assuming you want to use TextInputProps from react-native
    inputFontSize?: number
    variant?: Variant
    hasIcon?: boolean
    rightLabel?: string
}

type Variant =
    | 'email'
    | 'password'
    | 'mobile-number'
    | 'review'
    | 'name'
    | 'address'
    | 'zipcode'
    | 'city'
    | 'card-number'
    | 'calendar'
    | 'lock'
    | 'default'

export default function CustomTextInput({
    padding = '25px',
    marginBottom = '5px',
    customLabel,
    customLabelColor,
    variant = 'default',
    // isFilled = false,
    inputProps,
    inputFontSize,
    hasIcon = false,
    rightLabel,
}: CustomTextInputProps) {
    const iconMap: Record<Variant, string> = {
        email: 'mail',
        password: 'lock',
        'mobile-number': 'phone',
        review: 'edit-2',
        name: 'user',
        address: 'map-pin',
        zipcode: 'hash',
        city: 'home',
        'card-number': 'credit-card',
        calendar: 'calendar',
        lock: 'lock',
    }

    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible)
    }

    return (
        <View className={`w-full mb-6 flex-col`}>
            {customLabel ? (
                <View className="flex-row justify-between items-center mb-[5px]">
                    {/* LEFT LABEL */}
                    <Text
                        style={{ color: customLabelColor || '#c1c6d7' }}
                        className="text-[16px] text-heading"
                    >
                        {customLabel}
                    </Text>

                    {/* RIGHT LABEL */}
                    {rightLabel && (
                        <Text className="text-[10px] text-body text-[#8B90A0]">
                            {rightLabel}
                        </Text>
                    )}
                </View>
            ) : null}
            <View className="w-full flex-row items-center bg-[#010F1F] px-4 py-2">
                {hasIcon && (
                    <View className="mr-[10px]">
                        {variant !== 'default' && iconMap[variant] && (
                            <Feather
                                name={iconMap[variant]}
                                size={24}
                                color="#8B90A0"
                            />
                        )}
                    </View>
                )}
                {variant === 'mobile-number' && (
                    <Text className="mr-2">+63</Text>
                )}
                <TextInput
                    {...inputProps}
                    multiline={variant === 'review'}
                    textAlignVertical={variant === 'review' ? 'top' : 'center'}
                    className={`text-${inputFontSize} ${
                        variant === 'review' ? 'min-h-[100px] py-3' : ''
                    }`}
                    secureTextEntry={
                        variant === 'password' && !isPasswordVisible
                    }
                    placeholderTextColor="#8B90A0"
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
        </View>
    )
}
