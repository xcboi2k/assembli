import React from 'react'
import {
    Text,
    TouchableOpacity,
    type TouchableOpacityProps,
} from 'react-native'

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
            className={`w-full py-[15px] rounded-[5px] flex-row items-center justify-center mb-6 ${
                disabled ? 'bg-neutral-700' : 'bg-primary-100'
            }`}
        >
            <Text
                className={`text-center text-xl ${
                    disabled ? 'text-neutral-400' : 'text-primary-900'
                } ${isBold ? 'font-headingBold' : 'font-headingRegular'}`}
            >
                {title}
            </Text>
        </TouchableOpacity>
    )
}
