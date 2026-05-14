import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import { Feather } from '@expo/vector-icons'

type Props = {
    onPress?: () => void
}

const AddCollectionCard = ({ onPress }: Props) => {
    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={onPress}
            className="border border-dashed border-primary-400 bg-background-200 p-5 mb-4"
        >
            {/* TOP */}
            <View className="flex-row items-start justify-between">
                {/* LEFT */}
                <View className="flex-1 pr-4">
                    <Text className="text-[11px] tracking-[2px] text-[#64748B] font-headingBold">
                        COLLECTION_NODE
                    </Text>

                    <Text className="text-[22px] text-primary-200 font-headingBold mt-2 leading-[30px]">
                        ADD_NEW_COLLECTION
                    </Text>

                    <Text className="text-[13px] text-[#64748B] font-body mt-3 leading-[20px]">
                        Register a new unit into the active operator inventory
                        system.
                    </Text>
                </View>

                {/* ICON */}
                <View className="w-14 h-14 border border-primary-400 items-center justify-center bg-primary-500/10">
                    <Feather name="plus" size={24} color="#ADC6FF" />
                </View>
            </View>

            {/* FOOTER */}
            <View className="flex-row items-center justify-between mt-6 pt-4 border-t border-[#1E293B]">
                {/* STATUS */}
                <View>
                    <Text className="text-[10px] tracking-[2px] text-[#64748B] font-headingRegular">
                        SYSTEM_ACCESS
                    </Text>

                    <View className="flex-row items-center mt-2">
                        <View className="w-2 h-2 bg-primary-300 mr-2" />

                        <Text className="text-[11px] text-primary-200 font-bodyMedium tracking-[1px]">
                            READY
                        </Text>
                    </View>
                </View>

                {/* ACTION */}
                <View className="flex-row items-center">
                    <Text className="text-[11px] tracking-[2px] text-primary-200 font-headingBold mr-2">
                        INITIALIZE
                    </Text>

                    <Feather name="arrow-right" size={14} color="#ADC6FF" />
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default AddCollectionCard
