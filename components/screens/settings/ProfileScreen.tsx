import React from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Entypo, Feather, MaterialIcons } from '@expo/vector-icons'

import Header from '@/components/shared/Header'
import ButtonText from '@/components/shared/ButtonText'

export default function ProfileScreen() {
    return (
        <>
            <Header title="" variant="settings" />
            <View className="flex-1 bg-[#0F1113] p-4">
                <ScrollView>
                    <View className="border border-[#1E293B] bg-[#1A1C1E] p-4 mb-4">
                        <Text className="text-[16px] tracking-[2px] text-white font-headingRegular mb-1">
                            OPERATOR_ID: TEST
                        </Text>

                        <Text className="text-[#64748B] text-[12px] leading-6 font-body mb-1">
                            JOIN_DATE: 2026.05.11
                        </Text>
                        <Text className="text-[#64748B] text-[12px] leading-6 font-body mb-4">
                            STATUS: ACTIVE
                        </Text>

                        <View className="flex-row items-center">
                            <Text className="text-[16px] tracking-[2px] text-[#3B82F6] font-headingRegular mr-2">
                                CURRENT_RANK:
                            </Text>
                            <View className="p-2 items-center justify-center bg-[#4B8Eff]">
                                <Text className="text-[#00285C] text-[14px] leading-6 font-bodyBold">
                                    MASTER_BUILDER
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View className="border border-[#1E293B] bg-[#1A1C1E] mb-4">
                        {/* HEADER */}
                        <View className="px-4 py-2 border-b-[#1E293B] bg-[#273647]/30 flex-row justify-between">
                            <Text className="text-[12px] text-white tracking-widest font-headingRegular">
                                TOTAL_BUILDS
                            </Text>
                            <MaterialIcons
                                name="build"
                                size={20}
                                color="#64748B"
                            />
                        </View>

                        <View className="p-4 items-center justify-center">
                            <Text className="text-[36px] tracking-[2px] text-white font-headingRegular mb-1">
                                1,248
                            </Text>
                            <Text className="text-[#64748B] text-[11px] leading-6 font-body">
                                COMPLETED_CYCLES
                            </Text>
                        </View>
                    </View>

                    <View className="border border-[#1E293B] bg-[#1A1C1E] mb-4">
                        {/* HEADER */}
                        <View className="px-4 py-2 border-b-[#1E293B] bg-[#273647]/30 flex-row justify-between">
                            <Text className="text-[12px] text-white tracking-widest font-headingRegular">
                                BACKLOG_DEPTH
                            </Text>
                            <Entypo name="box" size={20} color="#64748B" />
                        </View>

                        <View className="p-4 items-center justify-center">
                            <Text className="text-[36px] tracking-[2px] text-white font-headingRegular mb-1">
                                42
                            </Text>
                            <Text className="text-[#64748B] text-[11px] leading-6 font-body">
                                PENDING_UNITS
                            </Text>
                        </View>
                    </View>

                    <View className="border border-[#1E293B] bg-[#1A1C1E] mb-4">
                        {/* HEADER */}
                        <View className="px-4 py-2 border-b-[#1E293B] bg-[#273647]/30 flex-row justify-between">
                            <Text className="text-[12px] text-white tracking-widest font-headingRegular">
                                EFFICIENCY_RATING
                            </Text>
                            <Entypo
                                name="line-graph"
                                size={20}
                                color="#64748B"
                            />
                        </View>

                        <View className="p-4 items-center justify-center">
                            <Text className="text-[36px] tracking-[2px] text-white font-headingRegular mb-1">
                                98%
                            </Text>
                            <Text className="text-[#64748B] text-[11px] leading-6 font-body">
                                PRECISION_METRIC
                            </Text>
                        </View>
                    </View>

                    <ButtonText title="EXPORT_METRICS" isBold />
                </ScrollView>
            </View>
        </>
    )
}
