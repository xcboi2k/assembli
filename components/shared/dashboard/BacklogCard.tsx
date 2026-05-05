import React from 'react'
import { View, Text } from 'react-native'

type Variant = 'current' | 'new' | 'completed'

type Props = {
    variant?: Variant
    title: string
    subtitle?: string
    progress?: number
    progressLabel?: string
    badgeText?: string
}

const variantClasses = {
    current: {
        border: 'bg-primary-200/30',
        badge: 'bg-primary-400/20',
        progress: 'bg-primary-400',
    },
    new: {
        border: 'bg-secondary-200/30',
        badge: 'bg-secondary-500/20',
        progress: 'bg-secondary-500',
    },
    completed: {
        border: 'bg-green-500/30',
        badge: 'bg-green-700/20',
        progress: 'bg-green-400',
    },
}

const BacklogCard = ({
    variant = 'current',
    title,
    subtitle,
    progress = 0,
    progressLabel = 'PROGRESS',
    badgeText,
}: Props) => {
    const styles = variantClasses[variant]

    return (
        <View
            className={`w-full p-4 mb-4 bg-[#1A1C1E] border border-[#414755]`}
        >
            {/* HEADER */}
            <View className="flex-row justify-between items-start mb-4">
                <View>
                    {subtitle && (
                        <Text className="text-[12px] text-tertiary-400 tracking-widest font-headingRegular">
                            {subtitle}
                        </Text>
                    )}

                    <Text className="text-white text-[24px] font-headingBold">
                        {title}
                    </Text>
                </View>

                {badgeText && (
                    <View
                        className={`px-2 py-1 ${styles.badge} border ${styles.border}`}
                    >
                        <Text className="text-[10px] text-neutral-50 font-bodyBold tracking-wide">
                            {badgeText}
                        </Text>
                    </View>
                )}
            </View>

            {/* FOOTER */}
            <View>
                {/* LABEL ROW */}
                <View className="flex-row justify-between mb-1">
                    <Text className="text-[10px] text-neutral-400 tracking-widest font-headingRegular">
                        {progressLabel}
                    </Text>

                    <Text className="text-[10px] text-neutral-400 font-body">
                        {(progress * 100).toFixed(0)}%
                    </Text>
                </View>

                {/* PROGRESS BAR */}
                <View className="w-full h-[3px] bg-neutral-800 rounded overflow-hidden">
                    <View
                        className={`h-full ${styles.progress}`}
                        style={{ width: `${progress * 100}%` }}
                    />
                </View>
            </View>
        </View>
    )
}

export default BacklogCard
