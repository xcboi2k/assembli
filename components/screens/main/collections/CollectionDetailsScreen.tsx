import React, { useCallback, useEffect } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import Header from '@/components/shared/Header'
import BuildChecklist from '@/components/shared/collection/BuildChecklist'
import TelemetryPanel from '@/components/shared/collection/TelemetryPanel'
import { SessionHistory } from '@/components/shared/collection/SessionHistory'
import { Feather } from '@expo/vector-icons'
import useGetTasks from '@/hooks/main/tasks/useGetTasks'
import useGetTasksWithSubtasks from '@/hooks/main/useGetTasksWithSubTasks'
import { useFocusEffect } from '@react-navigation/core'

export default function CollectionDetailsScreen({ route, navigation }) {
    const item = route.params
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

    const { tasks, loading, getTasksWithSubtasks } = useGetTasksWithSubtasks()
    console.log('tasks:', JSON.stringify(tasks, null, 2))

    useFocusEffect(
        useCallback(() => {
            console.log('Mount Collection Details')
            getTasksWithSubtasks(item.id)

            return () => {
                console.log('Unmount Collection Details')
            }
        }, [])
    )

    return (
        <>
            <Header title="OPERATOR: TEST_USER" />
            <View className="flex-1 bg-[#0F1113] p-4">
                <ScrollView>
                    <View className="w-full">
                        <View className="flex-row items-start justify-between mb-2">
                            {/* TITLE */}
                            <Text className="flex-1 text-[32px] text-white font-headingBold uppercase pr-4">
                                {item.name}
                            </Text>

                            {/* EDIT BUTTON */}
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate('CollectionEdit', item)
                                }
                                className="w-11 h-11 border border-primary-500/40 bg-primary-500/5 items-center justify-center"
                            >
                                <Feather
                                    name="edit-2"
                                    size={16}
                                    color="#ADC6FF"
                                />
                            </TouchableOpacity>
                        </View>
                        {/* <View className="w-full flex-row justify-between items-center mb-6">
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
                        </View> */}
                    </View>

                    {tasks.length === 0 ? (
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('CollectionTaskAdd', {
                                    from: 'collection',
                                    item: item,
                                })
                            }
                            activeOpacity={0.85}
                            className="border border-dashed border-primary-500/40 bg-background-200 p-5 items-center justify-center"
                        >
                            {/* ICON */}
                            <View className="w-14 h-14 border border-primary-400 items-center justify-center bg-primary-500/10 mb-4">
                                <Feather
                                    name="plus"
                                    size={24}
                                    color="#ADC6FF"
                                />
                            </View>

                            {/* TITLE */}
                            <Text className="text-[18px] text-primary-200 font-headingBold tracking-[2px] text-center">
                                NO_TASKS_FOUND
                            </Text>

                            {/* DESCRIPTION */}
                            <Text className="text-[13px] text-[#64748B] font-body text-center mt-3 leading-[20px]">
                                Initialize a new task node to begin tracking
                                collection progress.
                            </Text>

                            {/* ACTION */}
                            <View className="flex-row items-center border border-primary-500/40 px-4 py-3 mt-5 bg-primary-500/5">
                                <Feather
                                    name="plus-circle"
                                    size={14}
                                    color="#ADC6FF"
                                />

                                <Text className="text-[11px] tracking-[2px] text-primary-200 font-headingBold ml-2">
                                    ADD_TASK
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ) : null}
                    {/* <BuildChecklist items={checklistData} />
                    <TelemetryPanel
                        stats={telemetryStats}
                        breakdown={telemetryBreakdown}
                    />
                    <SessionHistory sessions={sessions} /> */}
                </ScrollView>
            </View>
        </>
    )
}
