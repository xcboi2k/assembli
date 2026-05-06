import { View, Text } from 'react-native'

type Variant = 'displaying' | 'started' | 'in box'
type Props = {
    variant?: 'displaying' | 'started' | 'in box'
    header?: string
    title?: string
    subtitle?: string
    time?: string
    progress?: number
    footerLabel?: string
    footerValue?: string
}

const variantStyles = {
    displaying: {
        badge: 'bg-[#3B82F6]',
        progress: 'bg-[#3B82F6] border-[#3B82F6]',
    },
    started: {
        badge: 'bg-secondary-500',
        progress: 'bg-secondary-300 border-secondary-300',
    },
    'in box': {
        badge: 'bg-neutral-700',
        progress: 'bg-neutral-500 border-neutral-500',
    },
}

export default function CollectionItem({
    variant = 'displaying',
    header,
    title,
    subtitle,
    time,
    progress,
    footerLabel,
    footerValue,
}: Props) {
    const styles = variantStyles[variant]

    return (
        <View className="w-full mb-4">
            <View className="flex-row justify-between items-center bg-[#2D3339] p-2">
                <Text className="text-[10px] text-primary-200 tracking-widest font-headingRegular">
                    {header}
                </Text>

                <View className={`px-2 py-1 ${styles.badge}`}>
                    <Text className="text-[10px] text-neutral-50 font-label">
                        {variant.toUpperCase()}
                    </Text>
                </View>
            </View>
            <View className="p-4 bg-[#1A1C1E] border border-[#1E293B]">
                {/* TOP ROW */}

                {/* TITLE */}
                <Text className="text-[16px] text-white font-headingRegular">
                    {title}
                </Text>

                {/* SUBTITLE */}
                <Text className="text-[#64748B] text-[13px] mt-1 font-bodyMedium">
                    {subtitle}
                </Text>

                {/* TIME */}
                {time && (
                    <View className="mt-3">
                        <Text className="text-[10px] text-[#64748B] tracking-widest font-headingRegular">
                            WORK_TIME
                        </Text>
                        <Text className="text-[13px] text-primary-200 font-bodyMedium mt-1">
                            {time}
                        </Text>
                    </View>
                )}

                {/* PROGRESS */}
                {progress !== undefined && (
                    <View className="mt-3">
                        <Text className="text-[11px] text-[#64748B] tracking-widest mb-2 font-headingRegular">
                            COMPLETION
                        </Text>

                        <View className="w-full h-[8px] bg-[#0F172A] border border-[#1E293B]">
                            <View
                                className={`h-full ${styles.progress} border`}
                                style={{ width: `${progress * 100}%` }}
                            />
                        </View>
                    </View>
                )}

                {/* FOOTER */}
                {footerLabel && (
                    <View className="px-[16px] mt-3">
                        <Text className="text-[10px] text-[#64748B] font-headingRegular tracking-widest">
                            {footerLabel}
                        </Text>

                        <Text className="text-[13px] text-white font-bodyMedium">
                            {footerValue}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    )
}
