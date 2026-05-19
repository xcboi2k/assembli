import React, { useCallback, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import CustomLoader from '@/components/shared/CustomLoader'
import Header from '@/components/shared/Header'
import BuildChecklist from '@/components/shared/collection/BuildChecklist'
import BuildChecklistSkeleton from '@/components/skeletons/BuildChecklistSkeleton'
import LoaderStore from '@/stores/LoaderStore'
import { Feather } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/core'

import useGetCollectionsTree from '@/hooks/main/useGetCollectionsTree'
import { computeBuildProgress } from '@/helpers/computeBuildProgress'
import CollectionDetailsHeaderSkeleton from '@/components/skeletons/CollectionDetailsHeaderSkeleton'

export default function CollectionDetailsScreen({ route, navigation }) {
    const id = route.params

    const [refreshKey, setRefreshKey] = useState('0')

    const isLoading = LoaderStore((state) => state.isLoading)

    const { getByCollectionId, data, loading } = useGetCollectionsTree()

    // -----------------------------
    // IMPORTANT FIX: normalize data
    // -----------------------------
    const collection = data?.[0] ?? null

    console.log('collection:', collection)

    useFocusEffect(
        useCallback(() => {
            if (!id) return

            console.log('Mount Collection Details', id)

            getByCollectionId(Number(id))

            return () => {
                console.log('Unmount Collection Details')
            }
        }, [id, refreshKey])
    )

    const buildProgress = computeBuildProgress(collection?.tasks)

    return (
        <>
            <Header title="OPERATOR: TEST_USER" />

            <View className="flex-1 bg-[#0F1113] p-4">
                <ScrollView>
                    {/* TITLE */}
                    {loading ? (
                        <CollectionDetailsHeaderSkeleton />
                    ) : (
                        <View className="w-full">
                            <View className="flex-row items-start justify-between mb-2">
                                <Text className="flex-1 text-[32px] text-white font-headingBold uppercase pr-4">
                                    {collection?.name}
                                </Text>

                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.navigate(
                                            'CollectionEdit',
                                            collection
                                        )
                                    }
                                    className="w-11 h-11 border border-primary-500/40 bg-primary-500/5 items-center justify-center"
                                >
                                    <Feather
                                        name="edit-2"
                                        size={16}
                                        color="#ADC6FF"
                                    />
                                </TouchableOpacity>
                            </View>

                            <View className="w-full flex-row justify-between items-center mb-6">
                                <Text className="text-[12px] text-primary-200 tracking-widest font-headingBold">
                                    {buildProgress <= 0.25
                                        ? 'CONSTRUCTION_PHASE_01'
                                        : buildProgress <= 0.5
                                          ? 'CONSTRUCTION_PHASE_02'
                                          : buildProgress <= 0.75
                                            ? 'CONSTRUCTION_PHASE_03'
                                            : buildProgress > 0.75 &&
                                                buildProgress < 1
                                              ? 'CONSTRUCTION_PHASE_04'
                                              : buildProgress === 1
                                                ? 'COMPLETED'
                                                : ''}
                                </Text>

                                <Text className="text-[20px] text-primary-400 tracking-widest font-bodyMedium">
                                    {(buildProgress * 100).toFixed(0)}%
                                </Text>
                            </View>
                            <View className="mb-6">
                                <View className="w-full h-[16px] bg-[#0F172A] border border-[#1E293B] mb-2">
                                    <View
                                        className={`h-full border bg-[#3B82F6] border-[#3B82F6]`}
                                        style={{
                                            width: `${buildProgress * 100}%`,
                                        }}
                                    />
                                </View>
                                <View className="w-full flex-row justify-between items-center">
                                    <Text className="text-[11px] text-[#64748B] tracking-widest mb-2 font-headingRegular">
                                        SYSTEM_STABILITY: OPTIMAL
                                    </Text>
                                    <Text className="text-[11px] text-[#64748B] tracking-widest mb-2 font-headingRegular">
                                        {Math.round(
                                            Math.max(0, 1 - buildProgress) * 100
                                        )}
                                        % REMAINING
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* EMPTY STATE */}
                    {collection?.tasks?.length === 0 ? (
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('CollectionTaskAdd', id)
                            }
                            activeOpacity={0.85}
                            className="border border-dashed border-primary-500/40 bg-background-200 p-5 items-center justify-center mb-4"
                        >
                            <View className="w-14 h-14 border border-primary-400 items-center justify-center bg-primary-500/10 mb-4">
                                <Feather
                                    name="plus"
                                    size={24}
                                    color="#ADC6FF"
                                />
                            </View>

                            <Text className="text-[18px] text-primary-200 font-headingBold tracking-[2px] text-center">
                                NO_TASKS_FOUND
                            </Text>

                            <Text className="text-[13px] text-[#64748B] font-body text-center mt-3 leading-[20px]">
                                Initialize a new task node to begin tracking
                                collection progress.
                            </Text>

                            <View className="flex-row items-center border border-primary-500/40 px-4 py-3 mt-5 bg-primary-500/5">
                                <Feather
                                    name="plus-circle"
                                    size={14}
                                    color="#ADC6FF"
                                />

                                <Text className="text-[11px] tracking-[2px] text-primary-200 font-headingBold ml-2">
                                    ADD_TASK
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ) : null}

                    {/* LOADING */}
                    {loading ? (
                        <BuildChecklistSkeleton />
                    ) : (
                        <>
                            {collection?.tasks?.length > 0 && (
                                <BuildChecklist
                                    items={collection.tasks}
                                    updateRefreshKey={() => {
                                        const newKey = Math.random().toString()
                                        setRefreshKey(newKey)
                                    }}
                                />
                            )}
                        </>
                    )}
                </ScrollView>

                <CustomLoader visible={isLoading} />
            </View>
        </>
    )
}
