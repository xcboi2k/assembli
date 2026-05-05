import React from 'react'
import { ScrollView, Text, View } from 'react-native'

import Header from '@/components/shared/Header'
import BacklogCard from '@/components/shared/dashboard/BacklogCard'
import Heatmap from '@/components/shared/dashboard/Heatmap'
import StatCard from '@/components/shared/dashboard/StatCard'
import Section from '@/components/shared/dashboard/Section'
import TaskItem from '@/components/shared/dashboard/TaskItem'
import LogItem from '@/components/shared/dashboard/LogItem'

export default function DashboardScreen() {
    const heatmapData = Array.from({ length: 35 }).map((_, i) => ({
        date: `2026-01-${i + 1}`,
        value: Math.floor(Math.random() * 5), // 0–4
    }))

    return (
        <>
            <Header title="SYSTEM_STATUS: NOMINAL" />
            <View className="flex-1 bg-background-100 p-4">
                <ScrollView>
                    <BacklogCard
                        variant="current"
                        subtitle="CURRENT_PROJECT"
                        title="MG WING ZERO EW"
                        progress={0.65}
                        progressLabel="BUILDING_PHASE"
                        badgeText="65% COMPLETE"
                    />
                    <BacklogCard
                        variant="new"
                        subtitle="SYSTEM_INITIALIZATION"
                        title="HG ZAKU 1"
                        progress={1}
                        progressLabel="ACQUIRED_PHASE"
                        badgeText="100% COMPLETE"
                    />
                    <BacklogCard
                        variant="completed"
                        subtitle="FINISHED_PROJECT"
                        title="MG THE-O"
                        progress={1}
                        progressLabel="DISPLAYING_PHASE"
                        badgeText="100% COMPLETE"
                    />
                    <Heatmap
                        title="BUILD_ACTIVITY_LOG"
                        data={heatmapData}
                        maxValue={4}
                    />

                    {/* ================= STATS ================= */}
                    <View className="w-full flex-row justify-between mb-4">
                        <StatCard label="ACQUIRED" value="42" />
                        <StatCard label="ONGOING" value="03" highlight />
                        <StatCard label="COMPLETED" value="128" />
                    </View>

                    {/* ================= UPCOMING TASKS ================= */}
                    <Section title="UPCOMING_TASKS" showAdd>
                        <TaskItem
                            title="SANDINI._FINISH_WIN!_S"
                            tag="ALPHA-1"
                            active
                        />

                        <TaskItem
                            title="DRONE_FIRMWARE_FLASH"
                            tag="BETA-4"
                            active={false}
                        />

                        <TaskItem
                            title="SOLVENT_INVENTORY_CHECK"
                            tag="GAMMA-2"
                            active={false}
                        />
                    </Section>

                    {/* ================= LOG ENTRIES ================= */}
                    <Section title="LOG_ENTRIES">
                        <LogItem
                            time="2024-10-24 09:15:01"
                            text="Surface primer applied to Wing-L-01. Cure time initiated (12h)."
                        />

                        <LogItem
                            time="2024-10-23 18:42:55"
                            text="TX-700 Core housing delivery confirmed. Visual inspection passed."
                        />

                        <LogItem
                            time="2024-10-23 14:20:12"
                            text="Decal sheet #4 finalized. Applied matte topcoat to shield assembly."
                        />
                    </Section>
                </ScrollView>
            </View>
        </>
    )
}
