import { createContext, useContext, useState, ReactNode, useRef } from 'react'

import { Animated, Text, View } from 'react-native'

import { Feather } from '@expo/vector-icons'

type ToastType = 'success' | 'error' | 'info'

type ToastContextType = {
    showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export const useToast = () => {
    const context = useContext(ToastContext)

    if (!context) {
        throw new Error('useToast must be used inside ToastProvider')
    }

    return context
}

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [message, setMessage] = useState('')
    const [type, setType] = useState<ToastType>('info')

    const translateY = useRef(new Animated.Value(-120)).current

    const opacity = useRef(new Animated.Value(0)).current

    const showToast = (msg: string, toastType: ToastType = 'info') => {
        setMessage(msg)
        setType(toastType)

        Animated.parallel([
            Animated.sequence([
                Animated.timing(translateY, {
                    toValue: 55,
                    duration: 350,
                    useNativeDriver: true,
                }),

                Animated.delay(2200),

                Animated.timing(translateY, {
                    toValue: -120,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]),

            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),

                Animated.delay(2200),

                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]),
        ]).start()
    }

    const toastStyles = {
        success: {
            border: '#4B8EFF',
            icon: '#ADC6FF',
            label: 'SYSTEM_SUCCESS',
        },

        error: {
            border: '#EF4444',
            icon: '#F87171',
            label: 'SYSTEM_FAILURE',
        },

        info: {
            border: '#334155',
            icon: '#ADC6FF',
            label: 'SYSTEM_NOTICE',
        },
    }[type]

    const toastIcon = {
        success: 'check-circle',
        error: 'x-circle',
        info: 'info',
    }[type] as keyof typeof Feather.glyphMap

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            <Animated.View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 16,
                    right: 16,
                    zIndex: 9999,
                    opacity,
                    transform: [{ translateY }],
                }}
            >
                <View
                    className="border bg-background-200 px-4 py-4"
                    style={{
                        borderColor: toastStyles.border,
                    }}
                >
                    <View className="flex-row items-start">
                        {/* ICON */}
                        <View
                            className="w-10 h-10 border items-center justify-center mr-3"
                            style={{
                                borderColor: toastStyles.border,
                            }}
                        >
                            <Feather
                                name={toastIcon}
                                size={16}
                                color={toastStyles.icon}
                            />
                        </View>

                        {/* CONTENT */}
                        <View className="flex-1">
                            <Text
                                className="text-[10px] tracking-[2px] font-headingBold"
                                style={{
                                    color: toastStyles.icon,
                                }}
                            >
                                {toastStyles.label}
                            </Text>

                            <Text className="text-[13px] text-[#CBD5E1] font-body mt-1 leading-[20px]">
                                {message}
                            </Text>
                        </View>
                    </View>
                </View>
            </Animated.View>
        </ToastContext.Provider>
    )
}
