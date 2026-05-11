import React from 'react'
import { Text, TouchableOpacity, type TouchableOpacityProps } from 'react-native'

type ButtonTextProps = {
    title: string
    isBold?: boolean
} & Pick<TouchableOpacityProps, 'onPress' | 'disabled' | 'accessibilityLabel'>

export default function ButtonText({
    title,
    isBold = false,
    onPress,
    disabled,
    accessibilityLabel,
}: ButtonTextProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            accessibilityLabel={accessibilityLabel}
            className="w-full bg-primary-100 py-[15px] rounded-[5px] flex flex-row items-center justify-center mb-6"
        >
            <Text
                className={`text-center text-primary-900 text-xl ${isBold ? 'font-headingBold' : 'font-headingRegular'}`}
            >
                {title}
            </Text>
        </TouchableOpacity>
    )
}
