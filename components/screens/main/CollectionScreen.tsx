import React, { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'

import Header from '@/components/shared/Header'
import SearchBar from '@/components/shared/collection/SearchBar'
import FilterTabs from '@/components/shared/collection/FilterTabs'
import CollectionItem from '@/components/shared/collection/CollectionItem'
import StatsGrid from '@/components/shared/collection/StatsGrid'

export default function CollectionScreen() {
    const [activeTab, setActiveTab] = useState('ALL')
    return (
        <>
            <Header title="COLLECTION" />
            <View className="flex-1 bg-[#0F1113] p-4">
                <ScrollView>
                    <SearchBar />

                    <FilterTabs active={activeTab} setActive={setActiveTab} />

                    <CollectionItem
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
                    />
                </ScrollView>
            </View>
        </>
    )
}
