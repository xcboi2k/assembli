import { View, TextInput } from 'react-native'
import { Feather } from '@expo/vector-icons'

export default function SearchBar() {
    return (
        <View className="w-full px-4 py-2 bg-[#1A1C1E] border border-[#1E293B] flex-row items-center">
            <Feather name="search" size={18} color="#64748B" />

            <TextInput
                placeholder="QUERY_SERIAL_OR_MODEL..."
                placeholderTextColor="#475569"
                className="ml-2 flex-1 font-bodyMedium text-[13px]"
            />
        </View>
    )
}
