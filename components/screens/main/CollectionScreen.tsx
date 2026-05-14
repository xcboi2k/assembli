import React, { useCallback, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import Header from '@/components/shared/Header'
import SearchBar from '@/components/shared/collection/SearchBar'
import FilterTabs from '@/components/shared/collection/FilterTabs'
import CollectionItem from '@/components/shared/collection/CollectionItem'
import StatsGrid from '@/components/shared/collection/StatsGrid'

import { CollectionsStackParamList } from '@/navigation'
import useGetCollectionItems from '@/hooks/main/collections/useGetCollectionItems'
import { useRefresh } from '@/hooks/useRefresh'
import CollectionSkeleton from '@/components/skeletons/CollectionSkeleton'

export default function CollectionScreen() {
    const navigation =
        useNavigation<NativeStackNavigationProp<CollectionsStackParamList>>()

    const [activeTab, setActiveTab] = useState('ALL')

    const { data, loading, getCollectionItems } = useGetCollectionItems()
    console.log('collection data:', data)

    useFocusEffect(
        useCallback(() => {
            console.log('Mount Collection')
            getCollectionItems()

            return () => {
                console.log('Unmount Collection')
            }
        }, [])
    )

    const handleNavigation = (item) =>
        navigation.navigate('CollectionDetails', item)

    const { refreshing, onRefresh } = useRefresh({
        postRefresh: () => getCollectionItems(),
    })

    return (
        <>
            <Header title="COLLECTION" />
            <View className="flex-1 bg-[#0F1113] p-4">
                <ScrollView>
                    {loading ? (
                        <CollectionSkeleton />
                    ) : (
                        <>
                            {data?.length ? (
                                <>
                                    <SearchBar />

                                    <FilterTabs
                                        active={activeTab}
                                        setActive={setActiveTab}
                                    />
                                    {data?.map((item, index) => (
                                        <CollectionItem
                                            key={index}
                                            variant="displaying"
                                            header={`UNIT_${item.id}`}
                                            title={item.name}
                                            subtitle={item.series}
                                            time="42:15:00"
                                            progress={0.9}
                                            onPress={() =>
                                                handleNavigation(item)
                                            }
                                        />
                                    ))}
                                </>
                            ) : (
                                <View className="items-center mt-6 mb-8 px-4">
                                    {/* SYSTEM LABEL */}
                                    <Text className="text-[11px] tracking-[3px] text-[#64748B] font-headingBold text-center">
                                        COLLECTION_INITIALIZATION
                                    </Text>

                                    {/* TITLE */}
                                    <Text className="text-[24px] text-primary-200 font-headingBold text-center mt-3 leading-[32px]">
                                        ADD_NEW_COLLECTION
                                    </Text>

                                    {/* DESCRIPTION */}
                                    <Text className="text-center text-[13px] text-[#94A3B8] font-body mt-4 leading-[22px]">
                                        Register a new unit into the active
                                        operator inventory system and configure
                                        collection telemetry parameters.
                                    </Text>
                                </View>
                            )}
                        </>
                    )}

                    {/* <CollectionItem
                        variant="displaying"
                        header="UNIT_001 // UC-PROTOCOL"
                        title="RX-0 UNICORN GUNDAM"
                        subtitle="PERFECT GRADE / 1:60 SCALE / BANDAI SPIRITS"
                        time="42:15:00"
                        progress={0.9}
                    />

                    <CollectionItem
                        variant="started"
                        header="UNIT_024 // ARRAKIS-TECH"
                        title="DUNE ATREIDES ORNITHOPTER"
                        subtitle="ICONS SERIES / LEGO / 1369 PIECES"
                        time="04:22:12"
                        progress={0.25}
                    />

                    <CollectionItem
                        variant="in box"
                        header="UNIT_031 // ARMORED-CORE"
                        title="DECORATED CORE: WHITE-GLINT"
                        subtitle="VARIABLE INFINITY / KOTOBUKIYA / 1:72"
                        footerLabel="ACQUISITION"
                        footerValue="2024.03.12"
                    />

                    <StatsGrid
                        stats={[
                            { label: 'TOTAL_UNITS', value: '24' },
                            { label: 'BACKLOG_VAL', value: '$1,840.00' },
                            { label: 'COMPLETION_RATE', value: '68.4%' },
                            { label: 'STORAGE_CAP', value: '92%' },
                        ]}
                    /> */}
                </ScrollView>
            </View>
        </>
    )
}
