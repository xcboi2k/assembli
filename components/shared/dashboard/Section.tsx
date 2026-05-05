import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

export default function Section({ title, children, showAdd = false }) {
    return (
        <View className="mb-5 border border-[#414755] bg-[#1A1C1E]">
            {/* HEADER */}
            <View className="flex-row justify-between items-center px-3 py-2 border-b border-[#414755]">
                <Text className="text-[12px] text-white tracking-widest font-headingBold">
                    {title}
                </Text>

                {showAdd && (
                    <TouchableOpacity
                    // onPress={onAddPress}
                    >
                        <Ionicons name="add" size={20} color="white" />
                    </TouchableOpacity>
                )}
            </View>

            {/* CONTENT */}
            <View className="p-3">{children}</View>
        </View>
    )
}
