import React from 'react'
import { View, Text, TextInput, TextInputProps } from 'react-native'
import { Feather } from '@expo/vector-icons'

type Props = {
    label?: string
    value?: string
    onChangeText?: (text: string) => void
    placeholder?: string
    icon?: keyof typeof Feather.glyphMap
    multiline?: boolean
    editable?: boolean
    inputProps?: TextInputProps // Assuming you want to use TextInputProps from react-native
    hasStatus?: boolean
    statusText?: any
}

const FormTextInput = ({
    label,
    icon,
    multiline = false,
    editable = true,
    inputProps,
    hasStatus = false,
    statusText,
}: Props) => {
    return (
        <View className="mb-4">
            {/* LABEL */}
            {label && (
                <Text className="text-[12px] text-[#64748B] tracking-[2px] font-headingBold mb-2">
                    {label}
                </Text>
            )}

            {/* INPUT */}
            <View className="border border-[#1E293B] bg-[#0F1113] flex-row items-center px-3">
                <TextInput
                    {...inputProps}
                    placeholderTextColor="#6B7280"
                    multiline={multiline}
                    editable={editable}
                    className={`flex-1 text-white py-3 text-[16px] font-body ${
                        multiline ? 'min-h-[100px]' : ''
                    }`}
                />
                {/* 
                {icon && <Feather name={icon} size={16} color="#64748B" />} */}
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

export default FormTextInput
