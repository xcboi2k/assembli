import { CategoriesStackParamList } from '@/navigation'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useCallback } from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'

import CategoryCard from '@/components/shared/categories/CategoryCard'
import CategorySummary from '@/components/shared/categories/CategorySummary'
import CustomLoader from '@/components/shared/CustomLoader'
import Header from '@/components/shared/Header'
import CategoriesSkeleton from '@/components/skeletons/CategoriesSkeleton'
import useDeleteCategory from '@/hooks/main/categories/useDeleteCategory'
import useGetCategories from '@/hooks/main/categories/useGetCategories'
import { useRefresh } from '@/hooks/useRefresh'
import LoaderStore from '@/stores/LoaderStore'

export default function CategoriesScreen() {
    // const categoryData = [
    //     {
    //         id: 'CAT_001',
    //         category: 'GUNPLA',
    //         inventory: 14,
    //     },
    //     {
    //         id: 'CAT_002',
    //         category: 'LEGO',
    //         inventory: 82,
    //     },
    //     {
    //         id: 'CAT_003',
    //         category: 'MECHA',
    //         inventory: 5,
    //     },
    //     {
    //         id: 'CAT_004',
    //         category: 'SCALE_MODELS',
    //         inventory: 21,
    //     },
    //     {
    //         id: 'CAT_005',
    //         category: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    //         inventory: 150000,
    //     },
    // ]

    const navigation =
        useNavigation<NativeStackNavigationProp<CategoriesStackParamList>>()

    const isLoading = LoaderStore((state) => state.isLoading)
    const { categories, loading, fetchCategories } = useGetCategories()

    useFocusEffect(
        useCallback(() => {
            console.log('Mount Categories')
            fetchCategories()

            return () => {
                console.log('Unmount Categories')
            }
        }, [])
    )

    const handleNavigation = () => navigation.navigate('CategoriesAdd')

    const { deleteCategory } = useDeleteCategory()
    const handleDelete = (id) => {
        deleteCategory(id, fetchCategories())
    }

    const { refreshing, onRefresh } = useRefresh({
        postRefresh: () => fetchCategories(),
    })

    return (
        <>
            <Header title="CATEGORIES" />
            <View className="flex-1 bg-[#0F1113] p-4">
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    {loading ? (
                        <CategoriesSkeleton />
                    ) : (
                        <>
                            <CategorySummary
                                data={categories}
                                handleNavigation={handleNavigation}
                            />
                            {categories?.map((item) => (
                                <CategoryCard
                                    key={item.id}
                                    item={item}
                                    onEdit={() =>
                                        navigation.navigate(
                                            'CategoriesEdit',
                                            item
                                        )
                                    }
                                    onDelete={() => handleDelete(item.id)}
                                />
                            ))}
                        </>
                    )}
                </ScrollView>
                <CustomLoader visible={isLoading} />
            </View>
        </>
    )
}
