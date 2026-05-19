import React from 'react'
import { View } from 'react-native'
import Skeleton from '../shared/Skeleton'

export default function CollectionSkeleton() {
    return (
        <View className="px-4">
            {/* SEARCH BAR SKELETON */}
            <View className="flex-row items-center w-full px-4 py-3 bg-[#1A1C1E] border border-[#1E293B] mb-4">
                <Skeleton style="w-[18px] h-[18px] rounded" />
                <Skeleton style="ml-2 flex-1 h-[14px] rounded" />
            </View>

            {/* FILTER TABS SKELETON */}
            <View className="flex-row mb-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} style="mr-2 w-[70px] h-[28px] rounded" />
                ))}
            </View>

            {/* LIST SKELETON */}
            {Array.from({ length: 3 }).map((_, i) => (
                <View key={i} className="mb-4">
                    {/* HEADER */}
                    <View className="flex-row justify-between items-center bg-[#2D3339] p-2">
                        <Skeleton style="w-[80px] h-[10px] rounded" />
                        <Skeleton style="w-[60px] h-[18px] rounded" />
                    </View>

                    {/* BODY */}
                    <View className="p-4 bg-[#1A1C1E] border border-[#1E293B]">
                        {/* TITLE */}
                        <Skeleton style="w-[70%] h-[18px] rounded" />

                        {/* SUBTITLE */}
                        <Skeleton style="w-[50%] h-[14px] mt-2 rounded" />

                        {/* PROGRESS LABEL */}
                        <Skeleton style="w-[40%] h-[10px] mt-4 rounded" />

                        {/* PROGRESS BAR */}
                        <Skeleton style="w-full h-[8px] mt-2 rounded" />

                        {/* FOOTER */}
                        <View className="mt-4">
                            <Skeleton style="w-[40%] h-[10px] rounded" />
                            <Skeleton style="w-[60%] h-[14px] mt-2 rounded" />
                        </View>
                    </View>
                </View>
            ))}
        </View>
    )
}
