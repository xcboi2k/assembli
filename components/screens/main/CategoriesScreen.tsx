import React, { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'

import Header from '@/components/shared/Header'
import CategorySummary from '@/components/shared/categories/CategorySummary'
import CategoryCard from '@/components/shared/categories/CategoryCard'
export default function CategoriesScreen() {
    const categoryData = [
        {
            id: 'CAT_001',
            category: 'GUNPLA',
            inventory: 14,
        },
        {
            id: 'CAT_002',
            category: 'LEGO',
            inventory: 82,
        },
        {
            id: 'CAT_003',
            category: 'MECHA',
            inventory: 5,
        },
        {
            id: 'CAT_004',
            category: 'SCALE_MODELS',
            inventory: 21,
        },
        {
            id: 'CAT_005',
            category: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            inventory: 150000,
        },
    ]

    return (
        <>
            <Header title="CATEGORIES" />
            <View className="flex-1 bg-[#0F1113] p-4">
                <ScrollView>
                    <CategorySummary />
                    {categoryData?.map((item) => (
                        <CategoryCard
                            key={item.id}
                            item={item}
                            onEdit={() => console.log('EDIT', item.id)}
                            onDelete={() => console.log('DELETE', item.id)}
                        />
                    ))}
                </ScrollView>
            </View>
        </>
    )
}
