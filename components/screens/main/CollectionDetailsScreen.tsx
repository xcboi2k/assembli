import React from 'react'
import { ScrollView, Text, View } from 'react-native'

import Header from '@/components/shared/Header'
import BuildChecklist from '@/components/shared/collection/BuildChecklist'
import TelemetryPanel from '@/components/shared/collection/TelemetryPanel'
import { SessionHistory } from '@/components/shared/collection/SessionHistory'

export default function CollectionDetailsScreen() {
    const checklistData = [
        {
            title: 'Head Unit Assembly',
            done: true,
            subtasks: [
                {
                    title: 'Internal Frame & LED Integration',
                    status: 'COMPLETE [14:42]',
                },
            ],
        },
        {
            title: 'Lower Limb Logistics',
            done: false,
            subtasks: [
                { title: 'Hip Actuator Linkage', status: 'IN_PROGRESS' },
                { title: 'Knee Joint Articulation Layer', status: 'QUEUED' },
                { title: 'Ankle Piston Calibration', status: 'QUEUED' },
            ],
        },
    ]

    const telemetryStats = [
        { label: 'TOTAL_TIME', value: '42:18:04' },
        { label: 'RUNNERS_PROCESSED', value: '24 / 38' },
    ]

    const telemetryBreakdown = [
        { label: 'RUNNER_A (WHITE)', value: '100%' },
        { label: 'RUNNER_B (GREY)', value: '100%' },
        { label: 'RUNNER_C (BLUE/RED)', value: '45%' },
    ]

    const sessions = [
        {
            title: 'Session #01 - Hip Framework',
            time: '05:43:00 ELAPSED',
            date: '2023.11.04',
        },
        {
            title: 'Session #02 - Head Framework',
            time: '03:30:00 ELAPSED',
            date: '2023.11.06',
        },
    ]

    return (
        <>
            <Header title="OPERATOR: TEST_USER" />
            <View className="flex-1 bg-[#0F1113] p-4">
                <ScrollView>
                    <View className="w-full">
                        <Text className="text-[32px] text-white font-headingBold mb-2">
                            PG UNLEASHED RX-78-2
                        </Text>
                        <View className="w-full flex-row justify-between items-center mb-6">
                            <Text className="text-[12px] text-primary-200 tracking-widest font-headingBold">
                                CONSTRUCTION_PHASE_04
                            </Text>
                            <Text className="text-[20px] text-primary-400 tracking-widest font-bodyMedium">
                                82%
                            </Text>
                        </View>
                        <View className="mb-6">
                            <View className="w-full h-[16px] bg-[#0F172A] border border-[#1E293B] mb-2">
                                <View
                                    className={`h-full border bg-[#3B82F6] border-[#3B82F6]`}
                                    style={{ width: `${0.82 * 100}%` }}
                                />
                            </View>
                            <View className="w-full flex-row justify-between items-center">
                                <Text className="text-[11px] text-[#64748B] tracking-widest mb-2 font-headingRegular">
                                    SYSTEM_STABILITY: OPTIMAL
                                </Text>
                                <Text className="text-[11px] text-[#64748B] tracking-widest mb-2 font-headingRegular">
                                    18% REMAINING
                                </Text>
                            </View>
                        </View>
                    </View>

                    <BuildChecklist items={checklistData} />
                    <TelemetryPanel
                        stats={telemetryStats}
                        breakdown={telemetryBreakdown}
                    />
                    <SessionHistory sessions={sessions} />
                </ScrollView>
            </View>
        </>
    )
}
