import { Feather } from '@expo/vector-icons'
import { useEffect, useRef, useState } from 'react'
import {
    ActivityIndicator,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import Skeleton from '../Skeleton'

type Props = {
    onChange: (filters: {
        search: string
        activeTab: number | null
    }) => Promise<void> | void
    debounceMs?: number
    tabs: any[] | null
    activeTab: number | null
    setActiveTab: (id: number | null) => void
    loadingCategories: boolean
}

export default function SearchBar({
    onChange,
    debounceMs = 500,
    tabs,
    activeTab,
    setActiveTab,
    loadingCategories,
}: Props) {
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)

    const debounceRef = useRef<any>(null)

    const runFilters = async (value: string, tab: number | null) => {
        try {
            setLoading(true)

            await onChange({
                search: value,
                activeTab: tab,
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current)
        }

        debounceRef.current = setTimeout(() => {
            runFilters(search, activeTab)
        }, debounceMs)

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current)
            }
        }
    }, [search, activeTab, debounceMs, onChange])

    const handleClear = () => {
        setSearch('')
    }

    const handleManualSearch = async () => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current)
        }

        await runFilters(search, activeTab)
    }

    return (
        <>
            {/* SEARCH BAR */}
            <View className="w-full px-4 py-2 bg-[#1A1C1E] border border-[#1E293B] flex-row items-center">
                <Feather name="search" size={18} color="#64748B" />

                <TextInput
                    value={search}
                    onChangeText={setSearch}
                    onSubmitEditing={handleManualSearch}
                    placeholder="QUERY_SERIAL_OR_MODEL..."
                    placeholderTextColor="#475569"
                    className="ml-2 flex-1 font-bodyMedium text-[13px] text-white"
                />

                {loading ? (
                    <ActivityIndicator size="small" color="#64748B" />
                ) : search.length > 0 ? (
                    <TouchableOpacity
                        testID="clear-button"
                        onPress={handleClear}
                        className="ml-2"
                    >
                        <Feather name="x" size={18} color="#64748B" />
                    </TouchableOpacity>
                ) : null}

                <TouchableOpacity
                    testID="manual-search-button"
                    onPress={handleManualSearch}
                    className="ml-3 px-3 py-2 bg-[#2563EB] rounded-lg"
                >
                    <Feather name="arrow-right" size={16} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* TABS */}
            <View className="flex-row mb-4">
                {loadingCategories ? (
                    <>
                        {[1, 2, 3].map((item) => (
                            <Skeleton
                                key={item}
                                style="w-[80px] h-[10px] rounded"
                            />
                        ))}
                    </>
                ) : (
                    tabs?.map((tab) => {
                        const isActive = activeTab === tab.id

                        return (
                            <TouchableOpacity
                                key={tab.id}
                                onPress={() => setActiveTab(tab.id)}
                                className={`mr-2 px-4 py-2 rounded-lg ${
                                    isActive
                                        ? 'bg-white'
                                        : 'border border-[#1E293B]'
                                }`}
                            >
                                <Text
                                    className={`text-[12px] font-headingRegular tracking-widest ${
                                        isActive
                                            ? 'text-black'
                                            : 'text-neutral-500'
                                    }`}
                                >
                                    {tab.name}
                                </Text>
                            </TouchableOpacity>
                        )
                    })
                )}
            </View>
        </>
    )
}
