import React from 'react'
import { View, Text, TextInput } from 'react-native'
import { Feather } from '@expo/vector-icons'

type Props = {
    label?: string
    value: string
    onChangeText?: (text: string) => void
    placeholder?: string
    icon?: keyof typeof Feather.glyphMap
    multiline?: boolean
    editable?: boolean
}

const FormTextInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    icon,
    multiline = false,
    editable = true,
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
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
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
        </View>
    )
}

export default FormTextInput
