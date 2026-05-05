import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

export default function ButtonText({ title, isBold = false }) {
    return (
        <TouchableOpacity className="w-full bg-primary-100 py-[15px] rounded-[5px] flex flex-row items-center justify-center mb-6">
            <Text
                className={`text-center text-primary-900 text-xl ${isBold ? 'font-headingBold' : 'font-headingRegular'}`}
            >
                {title}
            </Text>
        </TouchableOpacity>
    )
}
