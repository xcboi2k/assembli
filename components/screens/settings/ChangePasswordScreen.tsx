import React from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Entypo, Feather, MaterialIcons } from '@expo/vector-icons'

import Header from '@/components/shared/Header'
import FormTextInput from '@/components/shared/FormTextInput'
import ButtonText from '@/components/shared/ButtonText'

export default function ChangePasswordScreen() {
    return (
        <>
            <Header title="" variant="settings" />
            <View className="flex-1 bg-[#0F1113] p-4">
                <ScrollView>
                    <View className="border border-[#1E293B] bg-[#1A1C1E] mb-4">
                        {/* HEADER */}
                        <View className="p-4 border-b-[#1E293B] bg-[#273647]/30 flex-row justify-between">
                            <Text className="text-[16px] text-white tracking-widest font-headingRegular">
                                CHANGE_PASSWORD
                            </Text>
                        </View>

                        <View className="p-4">
                            <FormTextInput
                                label="OLD PASSWORD"
                                // value={designation}
                                // onChangeText={setDesignation}
                                placeholder="Enter old password"
                            />
                            <FormTextInput
                                label="NEW PASSWORD"
                                // value={designation}
                                // onChangeText={setDesignation}
                                placeholder="Enter new password"
                            />
                            <FormTextInput
                                label="CONFIRM PASSWORD"
                                // value={designation}
                                // onChangeText={setDesignation}
                                placeholder="Confirm password"
                            />
                            <ButtonText title="UPDATE_CREDENTIALS" isBold />
                        </View>
                    </View>
                </ScrollView>
            </View>
        </>
    )
}
