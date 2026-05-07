import { View, Text } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list'

type Props = {
    label: string
    selectedValue: string
    onValueChange: (value: string) => void
    data: string[]
    errorMessage?: any
}

export default function CustomDropdown({
    label,
    selectedValue,
    onValueChange,
    data,
    errorMessage,
}: Props) {
    return (
        <View className="mb-4">
            <Text className="text-[10px] text-[#64748B] tracking-[2px] font-headingRegular mb-2">
                {label}
            </Text>

            <View className="border border-[#1E293B] bg-[#090C11]">
                <SelectList
                    setSelected={(val) => onValueChange(val)}
                    data={data}
                    save="key"
                    boxStyles={{
                        backgroundColor: '#090C11',
                        borderWidth: 2,
                        borderRadius: 8,
                        borderColor: '#1E293B',
                        height: 56,
                        alignItems: 'center',
                    }}
                    fontFamily="Inter"
                    dropdownStyles={{
                        backgroundColor: '#090C11',
                        borderColor: '#1E293B',
                    }}
                    maxHeight={100}
                />
            </View>
            <Text className="text-[10px] text-red-500 font-medium mt-1">
                {errorMessage}
            </Text>
        </View>
    )
}
