import { Entypo, Feather, FontAwesome } from '@expo/vector-icons'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { colors } from '@/constants/themes'

export default function Header({ title, variant = 'default' }) {
    return (
        <View className="w-full justify-center relative py-2 mt-10 bg-[#1A1C1E] border border-b-[#414755]">
            <View className="flex-row items-center justify-between px-4 py-2">
                {/* LEFT SECTION */}
                <View className="flex-row items-center flex-1">
                    {/* ICON */}
                    <Feather
                        name="package"
                        size={18}
                        color={colors.primary.colorThree}
                    />

                    <Text
                        className="font-headingRegular text-[16px] text-neutral-100 ml-2"
                        numberOfLines={1}
                    >
                        ASSEMBLI
                    </Text>
                </View>

                {/* RIGHT SECTION */}
                <View className="flex-row items-center">
                    {/* TEXT */}
                    <Text className="font-headingRegular text-[12px] text-[#8B90A0] mr-4">
                        {title}
                    </Text>
                    {/* COG ICON */}
                    <TouchableOpacity
                    // onPress={onPressSettings}
                    >
                        {variant === 'default' ? (
                            <FontAwesome name="cog" size={20} color="#8B90A0" />
                        ) : (
                            <Entypo name="back" size={20} color="#8B90A0" />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
