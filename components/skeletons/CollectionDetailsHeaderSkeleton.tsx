import React from 'react'
import { View } from 'react-native'
import Skeleton from '../shared/Skeleton'

export default function CollectionDetailsHeaderSkeleton() {
    return (
        <View className="w-full">
            {/* TITLE + EDIT BUTTON */}
            <View className="flex-row items-start justify-between mb-2">
                <View className="flex-1 pr-4">
                    <Skeleton style="w-[80%] h-[36px] rounded" />
                </View>

                <Skeleton style="w-11 h-11 rounded border border-primary-500/40" />
            </View>

            {/* PHASE + PERCENTAGE */}
            <View className="flex-row justify-between items-center mb-6">
                <Skeleton style="w-[60%] h-[12px] rounded" />
                <Skeleton style="w-[50px] h-[20px] rounded" />
            </View>

            {/* PROGRESS BAR */}
            <View className="mb-6">
                <Skeleton style="w-full h-[16px] rounded mb-2" />

                <View className="flex-row justify-between items-center">
                    <Skeleton style="w-[45%] h-[10px] rounded" />
                    <Skeleton style="w-[35%] h-[10px] rounded" />
                </View>
            </View>
        </View>
    )
}
