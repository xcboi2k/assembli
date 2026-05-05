import React from 'react'
import { View, Text, ScrollView } from 'react-native'

type HeatmapItem = {
    date: string
    value: number // intensity (0–4 or any scale)
}

type Props = {
    data: HeatmapItem[]
    maxValue?: number
    title?: string
}

const getColor = (value: number, max: number) => {
    const ratio = value / max

    if (ratio === 0) return 'bg-background-100'
    if (ratio < 0.25) return 'bg-primary-900'
    if (ratio < 0.5) return 'bg-primary-700'
    if (ratio < 0.75) return 'bg-primary-500'
    return 'bg-primary-300'
}

const Heatmap = ({ data, maxValue = 4, title }: Props) => {
    // group into weeks (7 per row)
    const weeks: HeatmapItem[][] = []
    for (let i = 0; i < data.length; i += 7) {
        weeks.push(data.slice(i, i + 7))
    }

    return (
        <View className="w-full p-4 bg-[#1A1C1E] border border-[#414755] mb-4">
            {/* TITLE */}
            {title && (
                <Text className="text-[12px] text-tertiary-400 tracking-widest font-headingBold mb-4">
                    {title}
                </Text>
            )}

            {/* SCROLLABLE GRID */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row">
                    {weeks.map((week, wIndex) => (
                        <View key={wIndex} className="mr-1">
                            {week.map((item, dIndex) => (
                                <View
                                    key={dIndex}
                                    className={`w-4 h-4 mb-1 ${getColor(
                                        item.value,
                                        maxValue
                                    )}`}
                                />
                            ))}
                        </View>
                    ))}
                </View>
            </ScrollView>

            <View className="flex-row mt-3 items-center justify-between">
                {/* LEFT */}
                <Text className="text-xs text-neutral-400 font-body">
                    JAN {new Date().getFullYear()}
                </Text>

                {/* CENTER (LEGEND) */}
                <View className="flex-row items-center">
                    <Text className="text-xs text-neutral-400 mr-2 font-body">
                        LOW
                    </Text>

                    <View className="flex-row">
                        <View className="w-3 h-3 bg-background-100 mr-1" />
                        <View className="w-3 h-3 bg-primary-900 mr-1" />
                        <View className="w-3 h-3 bg-primary-700 mr-1" />
                        <View className="w-3 h-3 bg-primary-500 mr-1" />
                        <View className="w-3 h-3 bg-primary-300" />
                    </View>

                    <Text className="text-xs text-neutral-400 ml-2 font-body">
                        HIGH
                    </Text>
                </View>

                {/* RIGHT */}
                <Text className="text-xs text-neutral-400 font-body">
                    DEC {new Date().getFullYear()}
                </Text>
            </View>
        </View>
    )
}

export default Heatmap
