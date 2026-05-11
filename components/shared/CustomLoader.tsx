import React, { useEffect, useRef } from 'react'
import { Modal, View, Text, Animated, Easing } from 'react-native'

type Props = {
    visible: boolean
    title?: string
    subtitle?: string
}

const CustomLoader = ({
    visible,
    title = 'SYSTEM_SYNCHRONIZATION',
    subtitle = 'INITIALIZING OPERATOR ENVIRONMENT',
}: Props) => {
    const rotateAnim = useRef(new Animated.Value(0)).current
    const pulseAnim = useRef(new Animated.Value(1)).current

    useEffect(() => {
        // CONTINUOUS ROTATION
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 4000,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            {
                resetBeforeIteration: true,
            }
        ).start()

        // PULSE
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.12,
                    duration: 900,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),

                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 900,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start()
    }, [])

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    })

    return (
        <Modal visible={visible} transparent animationType="fade">
            {/* BACKDROP */}
            <View className="flex-1 bg-black/80 items-center px-6">
                {/* PANEL */}
                <View className="w-full border border-[#1E293B] bg-background-200 p-10 mt-[30%]">
                    {/* ROTATING CORE */}
                    <View className="items-center justify-center mb-8 p-6">
                        {/* STATIC FRAME */}
                        <View className="relative items-center justify-center">
                            {/* ROTATING OUTER */}
                            <Animated.View
                                style={{
                                    transform: [{ rotate }],
                                }}
                                className="absolute items-center justify-center"
                            >
                                {/* TOP */}
                                <View className="absolute -top-2 w-2 h-2 bg-primary-300" />

                                {/* BOTTOM */}
                                <View className="absolute top-[110px] w-2 h-2 bg-primary-300" />

                                {/* LEFT */}
                                <View className="absolute -left-2 top-[54px] w-2 h-2 bg-primary-300" />

                                {/* RIGHT */}
                                <View className="absolute left-[110px] top-[54px] w-2 h-2 bg-primary-300" />

                                {/* OUTER RING */}
                                <View className="w-28 h-28 border border-primary-500/30 items-center justify-center" />
                            </Animated.View>

                            {/* INNER CORE */}
                            <Animated.View
                                style={{
                                    transform: [{ scale: pulseAnim }],
                                }}
                                className="w-20 h-20 border border-primary-400 bg-primary-500/5 items-center justify-center"
                            >
                                {/* CENTER */}
                                <Animated.View
                                    style={{
                                        transform: [{ scale: pulseAnim }],
                                    }}
                                    className="w-4 h-4 bg-primary-300"
                                />
                            </Animated.View>
                        </View>
                    </View>

                    {/* TEXT */}
                    <Text className="text-[11px] tracking-[3px] text-[#64748B] font-headingBold text-center">
                        ACTIVE_PROCESS
                    </Text>

                    <Text className="text-[22px] text-primary-200 font-headingBold text-center mt-3">
                        {title}
                    </Text>

                    <Text className="text-[13px] text-[#64748B] font-body text-center mt-4 leading-[22px]">
                        {subtitle}
                    </Text>

                    {/* PROGRESS */}
                    {/* <View className="mt-8">
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-[10px] tracking-[2px] text-[#64748B] font-headingRegular">
                                PROCESS_STATE
                            </Text>

                            <Text className="text-[10px] tracking-[2px] text-primary-200 font-headingRegular">
                                LOADING
                            </Text>
                        </View>

                        <View className="h-[6px] bg-[#0F172A] border border-[#1E293B] overflow-hidden">
                            <View className="h-full w-2/3 bg-primary-400" />
                        </View>
                    </View> */}

                    {/* FOOTER */}
                    <View className="flex-row justify-between mt-8 pt-5 border-t border-[#1E293B]">
                        {/* STATUS */}
                        <View>
                            <Text className="text-[10px] tracking-[2px] text-[#64748B] font-headingRegular">
                                LINK_STATUS
                            </Text>

                            <View className="flex-row items-center mt-2">
                                <View className="w-2 h-2 bg-primary-300 mr-2" />

                                <Text className="text-[11px] text-primary-200 font-bodyMedium tracking-[1px]">
                                    CONNECTED
                                </Text>
                            </View>
                        </View>

                        {/* VERSION */}
                        <View className="items-end">
                            <Text className="text-[10px] tracking-[2px] text-[#64748B] font-headingRegular">
                                NODE_VERSION
                            </Text>

                            <Text className="text-[11px] text-[#CBD5E1] font-bodyMedium mt-2 tracking-[1px]">
                                SYS_V1.0.0
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default CustomLoader
