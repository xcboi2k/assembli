import { View, Text, TouchableOpacity } from 'react-native'

const tabs = ['ALL', 'GUNPLA', 'LEGO', 'OTHER']

export default function FilterTabs({ active, setActive }) {
    return (
        <View className="flex-row mb-4">
            {tabs.map((tab) => {
                const isActive = active === tab

                return (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => setActive(tab)}
                        className={`mr-2 px-4 py-2 ${
                            isActive ? 'bg-white' : 'border border-[#1E293B]'
                        }`}
                    >
                        <Text
                            className={`text-[12px] font-headingRegular tracking-widest ${
                                isActive ? 'text-black' : 'text-neutral-500'
                            }`}
                        >
                            {tab}
                        </Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}
