import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Entypo, Feather, MaterialIcons } from '@expo/vector-icons'

import Header from '@/components/shared/Header'

export default function NotificationsScreen() {
    const settingsData = [
        {
            id: 1,
            title: 'BUILD_REMINDERS',
            subtitle: 'NOTIFY ON SCHEDULE DEPLETION',
            enabled: true,
        },
        {
            id: 2,
            title: 'DEPOT_UPDATES',
            subtitle: 'INVENTORY STATUS LOG',
            enabled: false,
        },
        {
            id: 3,
            title: 'SYSTEM_DIAGNOSTICS',
            subtitle: 'PERIODIC HEALTH REPORT',
            enabled: true,
        },
    ]

    const [settings, setSettings] = useState(settingsData)

    const toggleSwitch = (id: number) => {
        setSettings((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          enabled: !item.enabled,
                      }
                    : item
            )
        )
    }

    return (
        <>
            <Header title="" variant="settings" />
            <View className="flex-1 bg-[#0F1113] p-4">
                <ScrollView>
                    <View className="border border-[#1E293B] bg-[#1A1C1E] mb-4">
                        {/* HEADER */}
                        <View className="p-4 border-b-[#1E293B] bg-[#273647]/30 flex-row justify-between">
                            <Text className="text-[16px] text-white tracking-widest font-headingRegular">
                                NOTIFICATION_MATRIX
                            </Text>
                        </View>

                        <View className="p-4">
                            {settings.map((item) => (
                                <View
                                    className="border-b border-[#1E293B] mb-4"
                                    key={item.id}
                                >
                                    <View className="flex-row items-center justify-between mb-2">
                                        {/* LEFT */}
                                        <View className="flex-1 pr-4">
                                            <Text className="text-[16px] text-[#E2E8F0] font-headingRegular tracking-[1px]">
                                                {item.title}
                                            </Text>

                                            <Text className="text-[13px] text-[#516072] font-body mt-1 tracking-[1px]">
                                                {item.subtitle}
                                            </Text>
                                        </View>

                                        {/* SWITCH */}
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() =>
                                                toggleSwitch(item.id)
                                            }
                                            className={`
                                           w-[52px]
                                           h-[26px]
                                           border
                                           px-[3px]
                                           justify-center
                                           ${
                                               item.enabled
                                                   ? 'bg-primary-400 border-primary-300'
                                                   : 'bg-[#233143] border-[#39485A]'
                                           }
                                       `}
                                        >
                                            <View
                                                className={`
                                               w-[16px]
                                               h-[16px]
                                               bg-[#E2E8F0]
                                               ${
                                                   item.enabled
                                                       ? 'self-end'
                                                       : 'self-start'
                                               }
                                           `}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </>
    )
}
