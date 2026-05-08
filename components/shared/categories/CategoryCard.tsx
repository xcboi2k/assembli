import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'

type CategoryRecord = {
    id: string
    category: string
    inventory: number
}

type CategoryCardProps = {
    item: CategoryRecord
    onEdit?: () => void
    onDelete?: () => void
}

export default function CategoryCard({
    item,
    onEdit,
    onDelete,
}: CategoryCardProps) {
    const formatCompactNumber = (num: number) => {
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1)}M`
        }

        if (num >= 1000) {
            return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}K`
        }

        return num.toString()
    }

    return (
        <View className="border border-[#414755] bg-[#0D1C2D] p-3 mb-4">
            <View className="flex-row items-start justify-between">
                {/* LEFT */}
                <View className="flex-1 pr-4">
                    <View className="flex-1">
                        <Text className="text-[13px] tracking-[2px] text-[#C1C6D7] font-bodyMedium">
                            ID_{item.id}
                        </Text>
                        <Text className="text-[16px] text-[#D4E4FA] font-headingBold mt-2">
                            {item.category}
                        </Text>
                    </View>
                </View>

                {/* RIGHT */}
                <View className="flex-row items-center">
                    {/* INVENTORY */}
                    <View className="items-center mr-4">
                        <Text className="text-[11px] tracking-[2px] text-[#8B90A0] font-headingRegular text-center mb-1">
                            INVENTORY
                        </Text>

                        <Text className="text-[13px] text-primary-200 font-bodyMedium text-center">
                            {formatCompactNumber(item.inventory)} UNITS
                        </Text>
                    </View>

                    {/* EDIT */}
                    <TouchableOpacity
                        onPress={onEdit}
                        className="w-10 h-10 border border-[#334155] items-center justify-center mr-2"
                    >
                        <Feather name="edit-2" size={18} color="#ADC6FF" />
                    </TouchableOpacity>

                    {/* DELETE */}
                    <TouchableOpacity
                        onPress={onDelete}
                        className="w-10 h-10 border border-[#334155] items-center justify-center"
                    >
                        <Feather name="trash-2" size={18} color="#F87171" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
