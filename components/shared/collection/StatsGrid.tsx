import { View, Text } from 'react-native'

export default function StatsGrid({ stats }) {
    return (
        <View className="flex-row flex-wrap">
            {stats.map((item, index) => (
                <View key={index} className="w-1/2 p-3">
                    <View className="bg-[#122131] border border-[#1E293B] p-4">
                        <Text className="text-[11px] text-[#64748B] font-headingRegular tracking-widest">
                            {item.label}
                        </Text>

                        <Text className="text-primary-200 text-[24px] font-headingBold mt-2">
                            {item.value}
                        </Text>
                    </View>
                </View>
            ))}
        </View>
    )
}
