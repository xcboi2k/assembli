import React from 'react'
import { View, Text, ScrollView } from 'react-native'

export default function TaskItem({ title, tag, active }) {
    return (
        <View className="flex-row items-center mb-3">
            <View
                className={`w-1.5 h-full mr-3 ${
                    active ? 'bg-[#3b82f6]' : 'bg-[#334155]'
                }`}
            />

            <View>
                <Text className="text-white font-bodyBold">{title}</Text>
                <Text className="text-[12px] text-[#64748b]">{tag}</Text>
            </View>
        </View>
    )
}
