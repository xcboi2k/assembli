import { Feather, MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/core'
import {
    createNativeStackNavigator,
    NativeStackNavigationProp,
} from '@react-navigation/native-stack'
import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import Header from '@/components/shared/Header'
import { MainTabParamList, SettingsParamList } from '@/navigation/types'

export default function ProfileMenuScreen() {
    const navigation =
        useNavigation<NativeStackNavigationProp<SettingsParamList>>()

    const dashboardNavigation =
        useNavigation<NativeStackNavigationProp<MainTabParamList>>()

    const menuItems = [
        {
            icon: 'user',
            title: 'PROFILE_ACCESS',
            subtitle: 'VIEW OPERATOR DATA',
            onPress: () => navigation.navigate('Profile'),
        },
        {
            icon: 'lock',
            title: 'PASSWORD_OVERRIDE',
            subtitle: 'UPDATE SECURITY CREDENTIALS',
            onPress: () => navigation.navigate('ChangePassword'),
        },
        // {
        //     icon: 'bell',
        //     title: 'NOTIFICATION_MATRIX',
        //     subtitle: 'SYSTEM ALERTS AND TELEMETRY',
        //     onPress: () => navigation.navigate('Notifications'),
        // },
        {
            icon: 'dashboard',
            title: 'RETURN_TO_DASHBOARD',
            subtitle: '',
            onPress: () => dashboardNavigation.navigate('Dashboard'),
        },
    ]

    return (
        <>
            <Header title="" variant="settings" />
            <View className="flex-1 bg-[#0F1113] p-4">
                <ScrollView>
                    <View className="border border-[#1E293B] bg-[#1A1C1E] p-4 mb-4">
                        <Text className="text-[11px] tracking-[2px] text-[#64748B] font-headingBold">
                            SYSTEM_MENU
                        </Text>

                        <Text className="text-[28px] text-primary-200 font-headingBold mt-2">
                            OPERATOR_SETTINGS
                        </Text>

                        <Text className="text-[12px] text-[#64748B] font-body mt-2 leading-[20px]">
                            Configure operator preferences, security protocols,
                            and system notifications.
                        </Text>
                    </View>

                    <View className="border border-[#1E293B] bg-[#1A1C1E] p-4 mb-4">
                        {menuItems.map((item, index) => (
                            <SystemMenuItem
                                key={index}
                                icon={item.icon as any}
                                title={item.title}
                                subtitle={item.subtitle}
                                onPress={item.onPress}
                            />
                        ))}
                        <SystemMenuItem
                            icon="power"
                            title="SYSTEM_LOGOUT"
                            subtitle="TERMINATE ACTIVE SESSION"
                            danger
                            onPress={() => navigation.navigate('Logout')}
                        />
                    </View>
                </ScrollView>
            </View>
        </>
    )
}

type MenuItemProps = {
    icon: any
    title: string
    subtitle: string
    onPress?: () => void
    danger?: boolean
}

export const SystemMenuItem = ({
    icon,
    title,
    subtitle,
    onPress,
    danger = false,
}: MenuItemProps) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            className="border-b border-[#1E293B] mb-4"
        >
            <View className="flex-row items-center justify-between mb-4">
                {/* LEFT */}
                <View className="flex-row flex-1 items-center">
                    {/* ICON */}
                    <View
                        className={`w-12 h-12 border items-center justify-center mr-4
                        ${
                            danger
                                ? 'border-red-500 bg-red-500/10'
                                : 'border-[#334155] bg-[#0F172A]'
                        }`}
                    >
                        {icon === 'dashboard' ? (
                            <MaterialIcons
                                name={icon}
                                size={18}
                                color={danger ? '#F87171' : '#ADC6FF'}
                            />
                        ) : (
                            <Feather
                                name={icon}
                                size={18}
                                color={danger ? '#F87171' : '#ADC6FF'}
                            />
                        )}
                    </View>

                    {/* TEXT */}
                    <View className="flex-1 pr-3">
                        <Text
                            className={`text-[15px] tracking-[1px] font-headingBold
                            ${danger ? 'text-red-400' : 'text-[#E2E8F0]'}`}
                        >
                            {title}
                        </Text>

                        <Text className="text-[12px] text-[#64748B] font-body mt-1 tracking-[1px]">
                            {subtitle}
                        </Text>
                    </View>
                </View>

                {/* RIGHT */}
                <Feather name="chevron-right" size={18} color="#475569" />
            </View>
        </TouchableOpacity>
    )
}
