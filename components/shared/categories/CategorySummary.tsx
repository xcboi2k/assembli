import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'

export default function CategorySummary() {
    return (
        <View className="border border-[#414755] bg-[#122131] p-4 mb-4">
            {/* TOP */}
            <View className="flex-row justify-between items-start">
                {/* LEFT */}
                <View>
                    <Text className="text-[12px] tracking-[2px] text-[#64748B] font-headingBold">
                        ACTIVE_RECORDS
                    </Text>

                    <Text className="text-[24px] text-primary-200 font-bodyBold mt-1">
                        04
                    </Text>
                </View>

                {/* CATEGORY ACCESS */}
                <TouchableOpacity className="border border-primary-500 bg-primary-500/10 px-3 py-2 flex-row items-center">
                    <Feather name="plus" size={14} color="#ADC6FF" />

                    <Text className="text-[11px] tracking-[2px] text-primary-200 ml-2 font-headingBold">
                        ADD_CATEGORY
                    </Text>
                </TouchableOpacity>
            </View>

            {/* TOTAL COMPONENTS */}
            <View className="mt-4">
                <Text className="text-[12px] tracking-[2px] text-[#64748B] font-headingBold">
                    TOTAL_COMPONENTS
                </Text>

                <Text className="text-[24px] text-primary-200 font-bodyBold mt-1">
                    1,429
                </Text>
            </View>

            {/* SYSTEM STATUS */}
            <View className="mt-4">
                <Text className="text-[12px] tracking-[2px] text-[#64748B] font-headingBold">
                    SYSTEM_STATUS
                </Text>

                <View className="flex-row items-center mt-1">
                    <View className="w-2 h-2 rounded-full bg-primary-200 mr-2" />

                    <Text className="text-[13px] text-primary-200 font-bodyMedium tracking-[1px]">
                        OPERATIONAL
                    </Text>
                </View>
            </View>
        </View>
    )
}
