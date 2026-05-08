import { View, Text } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list'

type Props = {
    label: string
    selectedValue: string
    onValueChange: (value: string) => void
    data: any
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
            {label && (
                <Text className="text-[12px] text-[#64748B] tracking-[2px] font-headingBold mb-2">
                    {label}
                </Text>
            )}

            <View className="border border-[#1E293B] bg-[#0F1113]">
                <SelectList
                    setSelected={(val) => onValueChange(val)}
                    data={data}
                    save="key"
                    boxStyles={{
                        height: 56,
                        alignItems: 'center',
                    }}
                    inputStyles={{
                        fontSize: 16,
                        color: '#FFFFFF',
                    }}
                    dropdownTextStyles={{
                        fontSize: 16,
                        color: '#FFFFFF',
                    }}
                    fontFamily="inter"
                    maxHeight={100}
                />
            </View>
            {errorMessage && (
                <Text className="text-[10px] text-red-500 font-medium mt-1">
                    {errorMessage}
                </Text>
            )}
        </View>
    )
}
