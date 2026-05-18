import React from 'react'
import { View } from 'react-native'
import Skeleton from '../shared/Skeleton'

export default function BuildChecklistSkeleton() {
    return (
        <View className="border border-[#1E293B] bg-[#1A1C1E] mb-4">
            {/* HEADER */}
            <View className="px-4 py-2 border-b-[#1E293B] bg-[#273647]/30 flex-row justify-between items-center">
                <Skeleton style="w-40 h-3" />
                <Skeleton style="w-6 h-6 rounded-full" />
            </View>

            {/* LIST */}
            <View className="w-full p-4">
                {[1].map((_, i) => (
                    <View key={i} className="mb-6">
                        {/* TASK ROW */}
                        <View className="flex-row items-center mb-3">
                            {/* status icon */}
                            <Skeleton style="w-5 h-5 rounded-full mr-2" />

                            {/* title */}
                            <Skeleton style="flex-1 h-4" />

                            {/* actions */}
                            <View className="flex-row ml-2">
                                <Skeleton style="w-6 h-6 mr-2 rounded-md" />
                                <Skeleton style="w-6 h-6 rounded-md" />
                            </View>
                        </View>

                        {/* SUBTASK SECTION LINE INDENT */}
                        <View className="pl-6 relative">
                            <View className="absolute left-0 top-0 bottom-0 w-[1px] bg-[#64748B]" />

                            {/* SUBTASKS */}
                            {[1, 2, 3].map((_, j) => (
                                <View key={j} className="p-4 mb-2 bg-[#0F1113]">
                                    <View className="flex-row justify-between items-center">
                                        {/* LEFT SIDE */}
                                        <View className="flex-row items-center flex-1">
                                            <Skeleton style="w-4 h-4 mr-2" />

                                            <Skeleton style="flex-1 h-4" />
                                        </View>

                                        {/* RIGHT ACTIONS */}
                                        <View className="flex-row ml-2">
                                            <Skeleton style="w-5 h-5 mr-2" />
                                            <Skeleton style="w-5 h-5 mr-2" />
                                            <Skeleton style="w-5 h-5" />
                                        </View>
                                    </View>

                                    {/* STATUS CHIPS */}
                                    <View className="flex-row mt-3">
                                        <Skeleton style="w-20 h-6 mr-2 rounded-md" />
                                        <Skeleton style="w-24 h-6 mr-2 rounded-md" />
                                        <Skeleton style="w-20 h-6 rounded-md" />
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </View>
        </View>
    )
}
