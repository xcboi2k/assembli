import React from 'react'
import { View } from 'react-native'
import Skeleton from '../shared/Skeleton'

const ProfileAnalyticsSkeleton = () => {
    return (
        <>
            <View className="border border-[#1E293B] bg-[#1A1C1E] mb-4 overflow-hidden">
                {/* HEADER */}
                <View className="px-4 py-2 border-b border-[#1E293B] bg-[#273647]/30 flex-row justify-between items-center">
                    <Skeleton style="w-32 h-3" />
                    <Skeleton style="w-5 h-5 rounded" />
                </View>

                {/* BODY */}
                <View className="p-4 items-center justify-center">
                    <Skeleton style="w-28 h-10 mb-2" />
                    <Skeleton style="w-40 h-3" />
                </View>
            </View>
            <View className="border border-[#1E293B] bg-[#1A1C1E] mb-4 overflow-hidden">
                {/* HEADER */}
                <View className="px-4 py-2 border-b border-[#1E293B] bg-[#273647]/30 flex-row justify-between items-center">
                    <Skeleton style="w-32 h-3" />
                    <Skeleton style="w-5 h-5 rounded" />
                </View>

                {/* BODY */}
                <View className="p-4 items-center justify-center">
                    <Skeleton style="w-28 h-10 mb-2" />
                    <Skeleton style="w-40 h-3" />
                </View>
            </View>
            <View className="border border-[#1E293B] bg-[#1A1C1E] mb-4 overflow-hidden">
                {/* HEADER */}
                <View className="px-4 py-2 border-b border-[#1E293B] bg-[#273647]/30 flex-row justify-between items-center">
                    <Skeleton style="w-32 h-3" />
                    <Skeleton style="w-5 h-5 rounded" />
                </View>

                {/* BODY */}
                <View className="p-4 items-center justify-center">
                    <Skeleton style="w-28 h-10 mb-2" />
                    <Skeleton style="w-40 h-3" />
                </View>
            </View>
        </>
    )
}

export default ProfileAnalyticsSkeleton
