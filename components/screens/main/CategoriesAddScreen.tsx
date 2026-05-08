import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Feather, MaterialIcons } from '@expo/vector-icons'

import Header from '@/components/shared/Header'
import FormTextInput from '@/components/shared/FormTextInput'

export default function CategoriesAddScreen() {
    return (
        <>
            <Header title="INIT_NEW_ENTRY" />
            <View className="flex-1 bg-[#0F1113] p-4">
                <ScrollView>
                    {/* HERO PANEL */}
                    <View className="border border-[#1E293B] bg-[#1A1C1E] p-4">
                        <View className="w-[48%] bg-[#1E293B]/50 p-2">
                            <Text className="text-[11px] tracking-[2px] text-primary-200 font-headingRegular">
                                PROTOCOL_DATA_ENTRY
                            </Text>
                        </View>

                        <Text className="text-[32px] text-white font-headingBold mt-4">
                            CATEGORY_CREATE
                        </Text>

                        <Text className="text-[#94A3B8] text-[16px] leading-6 mt-4 font-body">
                            Initialize a new category node in the system.
                        </Text>
                    </View>

                    <View className="mt-4 border border-[#1E293B] bg-[#1A1C1E] p-4">
                        <View className="flex-row items-start">
                            <View className="flex-1">
                                <View className="flex-row items-center">
                                    <View className="mr-3">
                                        <Feather
                                            name="alert-circle"
                                            size={16}
                                            color="#ADC6FF"
                                            className="mr-2"
                                        />
                                    </View>
                                    <Text className="text-[13px] font-headingBold text-white">
                                        SYSTEM NOTE
                                    </Text>
                                </View>

                                <Text className="text-[16px] text-[#C1C6D7] font-body mt-2">
                                    This category requires manual task
                                    verification before commit.
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* FORM PANEL */}
                    <View className="bg-[#2D3339] py-2 px-6 flex-row justify-between">
                        <Text className="text-[13px] font-headingBold text-white">
                            SPECIFICATION_FIELDS
                        </Text>
                        <Text className="text-[13px] font-medium text-[#64748B]">
                            ID: TMP-4492
                        </Text>
                    </View>

                    <View className="border border-[#1E293B] bg-[#1A1C1E] p-6">
                        <FormTextInput
                            label="CATEGORY NAME"
                            // value={designation}
                            // onChangeText={setDesignation}
                            placeholder="e.g. MODEL KIT"
                        />
                        {/* FOOTER BUTTONS */}
                        <View className="flex-row mt-8">
                            {/* ABORT */}
                            <TouchableOpacity className="flex-1 border border-neutral-700 py-4 items-center mr-2">
                                <View className="flex-row items-center">
                                    <Feather
                                        name="x"
                                        size={16}
                                        color="#94A3B8"
                                    />

                                    <Text className="text-[#94A3B8] tracking-[2px] font-headingRegular text-[16px] ml-2">
                                        ABORT
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            {/* COMMIT */}
                            <TouchableOpacity className="flex-1 bg-primary-200 py-4 items-center ml-2">
                                <View className="flex-row items-center">
                                    <Feather
                                        name="check-circle"
                                        size={16}
                                        color="#001A41"
                                    />

                                    <Text className="text-black tracking-[2px] font-headingRegular text-[16px] ml-2">
                                        COMMIT
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </>
    )
}
