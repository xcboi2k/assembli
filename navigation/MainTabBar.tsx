import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { Feather } from '@expo/vector-icons'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { colors } from '@/constants/themes'

const ACTIVE = colors.primary.main
const INACTIVE = '#8B90A0'
const BAR_BG = '#1A1C1E'
const ACTIVE_TAB_BG = 'rgba(0, 122, 255, 0.08)'

const TAB_CONFIG: Record<
    string,
    { icon: keyof typeof Feather.glyphMap; label: string }
> = {
    Dashboard: { icon: 'layout', label: 'DASHBOARD' },
    Collections: { icon: 'package', label: 'COLLECTIONS' },
    Categories: { icon: 'layers', label: 'CATEGORIES' },
}

export default function MainTabBar({
    state,
    descriptors,
    navigation,
}: BottomTabBarProps) {
    const insets = useSafeAreaInsets()

    return (
        <View
            style={[
                styles.bar,
                {
                    paddingBottom: Math.max(insets.bottom, 10),
                    borderTopColor: '#414755',
                },
            ]}
        >
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key]
                const isFocused = state.index === index
                const cfg = TAB_CONFIG[route.name] ?? {
                    icon: 'circle' as const,
                    label: route.name,
                }

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    })
                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name)
                    }
                }

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    })
                }

                const color = isFocused ? ACTIVE : INACTIVE

                return (
                    <Pressable
                        key={route.key}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={
                            options.tabBarAccessibilityLabel ?? cfg.label
                        }
                        testID={options.tabBarButtonTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={[styles.tab, isFocused && styles.tabFocused]}
                    >
                        {isFocused ? (
                            <View style={styles.activeIndicator} />
                        ) : null}
                        <Feather name={cfg.icon} size={22} color={color} />
                        <Text
                            style={[
                                styles.label,
                                { color },
                                isFocused && styles.labelFocused,
                            ]}
                            numberOfLines={1}
                        >
                            {cfg.label}
                        </Text>
                    </Pressable>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    bar: {
        flexDirection: 'row',
        backgroundColor: BAR_BG,
        borderTopWidth: StyleSheet.hairlineWidth,
        paddingTop: 4,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        gap: 4,
    },
    tabFocused: {
        backgroundColor: ACTIVE_TAB_BG,
    },
    activeIndicator: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: ACTIVE,
    },
    label: {
        fontFamily: 'SpaceGrotesk_400Regular',
        fontSize: 9,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
    },
    labelFocused: {
        fontFamily: 'SpaceGrotesk_600SemiBold',
    },
})
