import React from 'react'
import { View, Text } from 'react-native'

type Props = {
    analytics: any
    userName?: string
}

export default function MetricsStory({ analytics, userName }: Props) {
    const now = new Date()

    const monthYear = now.toLocaleString('default', {
        month: 'long',
        year: 'numeric',
    })

    return (
        <View className="flex-1 bg-[#0B0F14] px-7 py-10 justify-between">
            {/* TOP HOOK */}
            <View>
                <Text className="text-[#64748B] text-xs tracking-widest">
                    PERFORMANCE REPORT · {monthYear.toUpperCase()}
                </Text>

                <Text className="text-white text-[28px] font-headingBold mt-3 leading-tight">
                    Your Productivity Snapshot
                </Text>

                <Text className="text-[#94A3B8] text-sm mt-2">
                    {userName ?? 'User'} · Cycle summary
                </Text>
            </View>

            {/* HERO METRIC */}
            <View className="items-center">
                <Text className="text-white text-[72px] font-headingBold tracking-widest">
                    {analytics?.buildCompletionRate ?? 0}%
                </Text>

                <Text className="text-[#64748B] text-xs tracking-[2px] mt-2">
                    COMPLETION RATE
                </Text>
            </View>

            {/* STATS BLOCK */}
            <View className="space-y-2">
                <View className="flex-row justify-between">
                    <Text className="text-[#94A3B8] text-sm">
                        Builds Completed
                    </Text>
                    <Text className="text-white text-sm font-headingRegular">
                        {analytics?.completedCollections ?? 0}
                    </Text>
                </View>

                <View className="flex-row justify-between">
                    <Text className="text-[#94A3B8] text-sm">Tasks Done</Text>
                    <Text className="text-white text-sm font-headingRegular">
                        {analytics?.completedTasks ?? 0}
                    </Text>
                </View>

                <View className="flex-row justify-between">
                    <Text className="text-[#94A3B8] text-sm">
                        Backlog Depth
                    </Text>
                    <Text className="text-white text-sm font-headingRegular">
                        {analytics?.backlogDepth ?? 0}
                    </Text>
                </View>
            </View>

            {/* FOOTER */}
            <View className="items-center space-y-2">
                <Text className="text-[#475569] text-[11px] text-center">
                    Built from your workflow data
                </Text>

                {/* BRANDING */}
                <Text className="text-[#334155] text-[11px] tracking-[2px]">
                    ASSEMBLI
                </Text>
            </View>
        </View>
    )
}
