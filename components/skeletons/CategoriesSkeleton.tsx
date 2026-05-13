import React from 'react'
import { View } from 'react-native'
import Skeleton from '../shared/Skeleton'

export default function CategoriesSkeleton() {
    return (
        <View className="w-full flex-1">
            <Skeleton style="border border-[#414755] bg-[#0D1C2D] p-3 mb-4 h-[30%]" />
            <Skeleton style="border border-[#414755] bg-[#0D1C2D] p-3 mb-4 h-[20%]" />
            <Skeleton style="border border-[#414755] bg-[#0D1C2D] p-3 mb-4 h-[20%]" />
            <Skeleton style="border border-[#414755] bg-[#0D1C2D] p-3 mb-4 h-[20%]" />
            <Skeleton style="border border-[#414755] bg-[#0D1C2D] p-3 mb-4 h-[20%]" />
        </View>
    )
}
