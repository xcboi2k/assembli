import React from 'react'
import { View, Text, ScrollView } from 'react-native'

export default function LogItem({ time, text }) {
    return (
        <View className="mb-4 border-l-2 border-[#334155] pl-3">
            <Text className="text-[#3b82f6] text-[12px] mb-1">{time}</Text>

            <Text className="text-[#cbd5e1] text-[12px]">{text}</Text>
        </View>
    )
}
