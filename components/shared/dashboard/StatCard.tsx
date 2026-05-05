import React from 'react'
import { View, Text, ScrollView } from 'react-native'

export default function StatCard({ label, value, highlight = false }) {
    return (
        <View className="flex-1 mx-1 p-3 bg-[#1A1C1E] border border-[#414755]">
            <Text className="text-[10px] text-[#64748b] text-center tracking-widest">
                {label}
            </Text>
            <Text
                className={`text-xl text-center font-bold mt-1 ${
                    highlight ? 'text-[#3b82f6]' : 'text-white'
                }`}
            >
                {value}
            </Text>
        </View>
    )
}
