import { View, Text } from 'react-native'
import { Feather } from '@expo/vector-icons'

export const SessionHistory = ({ sessions }) => {
    return (
        <View className="border border-[#1E293B] bg-[#1A1C1E] mb-4">
            {/* HEADER */}
            <View className="px-4 py-2 border-b-[#1E293B] bg-[#273647]/30 flex-row justify-between">
                <Text className="text-[12px] text-white tracking-widest font-headingRegular">
                    SESSION_HISTORY
                </Text>
                <Feather name="clock" size={20} color="#516072" />
            </View>
            <View className="p-4">
                {sessions.map((s, i) => (
                    <View key={i} className="flex-row mb-3">
                        {/* BULLET */}
                        <View className="w-2 h-2 rounded-full bg-primary-200 mt-2 mr-3" />

                        {/* CONTENT */}
                        <View className="flex-1">
                            <View className="flex-row justify-between items-start">
                                <Text className="flex-1 text-[16px] text-white font-body pr-2">
                                    {s.title}
                                </Text>

                                <Text className="text-[11px] text-[#64748B] font-body">
                                    {s.date}
                                </Text>
                            </View>

                            <Text className="text-[11px] text-[#64748B] font-body mt-1">
                                {s.time}
                            </Text>
                        </View>
                    </View>
                ))}

                {/* FOOTER */}
                <View className="mt-2 border border-[#334155] pt-2">
                    <Text className="text-[11px] text-[#64748B] text-center font-headingRegular">
                        VIEW_ALL_LOGS
                    </Text>
                </View>
            </View>
        </View>
    )
}
