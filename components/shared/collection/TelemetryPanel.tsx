import { View, Text } from 'react-native'
import Foundation from '@expo/vector-icons/Foundation'

export default function TelemetryPanel({ stats, breakdown }) {
    return (
        <View className="border border-[#1E293B] bg-[#1A1C1E] mb-4">
            {/* HEADER */}
            <View className="px-4 py-2 border-b-[#1E293B] bg-[#273647]/30 flex-row justify-between">
                <Text className="text-[12px] text-white tracking-widest font-headingRegular">
                    TELEMETRY_LOG
                </Text>
                <Foundation name="graph-bar" size={20} color="#64748B" />
            </View>

            <View className="p-4">
                {/* TOP STATS */}
                <View className="flex-row">
                    {stats.map((item, i) => (
                        <View
                            key={i}
                            className="flex-1 mr-2 border border-[#1E293B] p-3 bg-[#0F1113]"
                        >
                            <Text className="text-[11px] text-[#64748B]">
                                {item.label}
                            </Text>
                            <Text className="text-[20px] text-white font-body mt-1">
                                {item.value}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* BREAKDOWN */}
                <View className="mt-4">
                    {breakdown.map((b, i) => (
                        <View
                            key={i}
                            className="flex-row justify-between py-2 border-b border-[#1E293B]/50"
                        >
                            <Text className="text-[12px] text-[#94A3B8] font-body">
                                {b.label}
                            </Text>

                            <Text
                                className={`text-[12px] font-body ${
                                    b.value === '100%'
                                        ? 'text-primary-200'
                                        : 'text-secondary-200'
                                }`}
                            >
                                {b.value}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    )
}
