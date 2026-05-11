import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Entypo, Feather, MaterialIcons } from '@expo/vector-icons'

export const LogoutScreen = () => {
    return (
        <View className="flex-1 bg-[#0F1113] p-4">
            {/* PANEL */}
            <View className="border border-red-500/40 bg-background-200 px-6 py-8 mt-[40%]">
                {/* ICON */}
                <View className="items-center mb-6">
                    <View className="w-20 h-20 border border-red-500 items-center justify-center bg-red-500/10">
                        <Feather name="power" size={32} color="#F87171" />
                    </View>
                </View>

                {/* TEXT */}
                <Text className="text-[12px] tracking-[2px] text-red-400 font-headingBold text-center">
                    SESSION_TERMINATION
                </Text>

                <Text className="text-[28px] text-white font-headingBold text-center mt-3 leading-[36px]">
                    CONFIRM LOGOUT
                </Text>

                <Text className="text-[13px] text-[#64748B] text-center mt-4 leading-[22px] font-body">
                    Active operator session will be terminated. Unsaved
                    telemetry and configuration changes may be lost.
                </Text>

                {/* ACTIONS */}
                <View className="flex-row mt-8">
                    {/* CANCEL */}
                    <TouchableOpacity className="flex-1 border border-[#334155] py-4 items-center mr-2">
                        <View className="flex-row items-center">
                            <Feather
                                name="arrow-left"
                                size={16}
                                color="#94A3B8"
                            />

                            <Text className="text-[#94A3B8] tracking-[2px] ml-2 font-headingRegular">
                                RETURN
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* LOGOUT */}
                    <TouchableOpacity className="flex-1 bg-red-500/90 py-4 items-center ml-2">
                        <View className="flex-row items-center">
                            <Feather name="power" size={16} color="#FFFFFF" />

                            <Text className="text-white tracking-[2px] ml-2 font-headingBold">
                                LOGOUT
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
