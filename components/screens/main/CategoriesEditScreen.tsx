import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Feather, MaterialIcons } from '@expo/vector-icons'
import * as Yup from 'yup'
import { useFormik } from 'formik'

import Header from '@/components/shared/Header'
import FormTextInput from '@/components/shared/FormTextInput'
import LoaderStore from '@/stores/LoaderStore'
import useUpdateCategory from '@/hooks/main/categories/useUpdateCategory'
import CustomLoader from '@/components/shared/CustomLoader'

export default function CategoriesEditScreen({ route, navigation }) {
    const item = route.params
    console.log('categories edit params:', item)

    const isLoading = LoaderStore((state) => state.isLoading)

    const { updateCategory } = useUpdateCategory()
    const goToNextScreen = () => {
        const newKey = Math.random().toString()
        navigation.navigate('Categories', {
            screen: 'CategoriesHome',
            key: newKey,
        })
    }

    // Handle formik form submission
    const handleFormikSubmit = async (values, { resetForm }) => {
        updateCategory(
            item.id,
            {
                categoryName: values.categoryName,
                categoryDescription: values.categoryDescription,
            },
            resetForm,
            goToNextScreen
        )
    }

    const formik = useFormik({
        initialValues: {
            categoryName: item.name,
            categoryDescription: item.description,
        },
        onSubmit: handleFormikSubmit,
        validationSchema: Yup.object().shape({
            categoryName: Yup.string()
                .min(2, 'Name must be at least 2 characters')
                .max(50, 'Name must not exceed 50 characters')
                .required('Category name is required'),
        }),
    })

    return (
        <>
            <Header title="INIT_UPDATE_ENTRY" />
            <View className="flex-1 bg-[#0F1113] p-4">
                <ScrollView>
                    {/* HERO PANEL */}
                    <View className="border border-[#1E293B] bg-[#1A1C1E] p-4">
                        <View className="w-[48%] bg-[#1E293B]/50 p-2">
                            <Text className="text-[11px] tracking-[2px] text-primary-200 font-headingRegular">
                                PROTOCOL_DATA_ENTRY
                            </Text>
                        </View>

                        <Text className="text-[32px] text-white font-headingBold mt-4">
                            CATEGORY_UPDATE
                        </Text>

                        <Text className="text-[#94A3B8] text-[16px] leading-6 mt-4 font-body">
                            Update a category node in the system.
                        </Text>
                    </View>

                    <View className="mt-4 border border-[#1E293B] bg-[#1A1C1E] p-4">
                        <View className="flex-row items-start">
                            <View className="flex-1">
                                <View className="flex-row items-center">
                                    <View className="mr-3">
                                        <Feather
                                            name="alert-circle"
                                            size={16}
                                            color="#ADC6FF"
                                            className="mr-2"
                                        />
                                    </View>
                                    <Text className="text-[13px] font-headingBold text-white">
                                        SYSTEM NOTE
                                    </Text>
                                </View>

                                <Text className="text-[16px] text-[#C1C6D7] font-body mt-2">
                                    This category requires manual task
                                    verification before commit.
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* FORM PANEL */}
                    <View className="bg-[#2D3339] py-2 px-6 flex-row justify-between">
                        <Text className="text-[13px] font-headingBold text-white">
                            SPECIFICATION_FIELDS
                        </Text>
                    </View>

                    <View className="border border-[#1E293B] bg-[#1A1C1E] p-6">
                        <FormTextInput
                            label="CATEGORY NAME"
                            inputProps={{
                                placeholder: 'e.g. MODEL KIT',
                                onChangeText:
                                    formik.handleChange('categoryName'),
                                value: formik.values.categoryName,
                            }}
                            hasStatus={true}
                            statusText={
                                formik.errors.categoryName &&
                                formik.touched.categoryName &&
                                formik.errors.categoryName
                            }
                        />
                        <FormTextInput
                            label="CATEGORY DESCRIPTION"
                            inputProps={{
                                placeholder: 'Enter description',
                                onChangeText: formik.handleChange(
                                    'categoryDescription'
                                ),
                                value: formik.values.categoryDescription,
                            }}
                            multiline
                            hasStatus={true}
                            statusText={
                                formik.errors.categoryDescription &&
                                formik.touched.categoryDescription &&
                                formik.errors.categoryDescription
                            }
                        />
                        {/* FOOTER BUTTONS */}
                        <View className="flex-row mt-8">
                            {/* ABORT */}
                            <TouchableOpacity
                                className="flex-1 border border-neutral-700 py-4 items-center mr-2"
                                onPress={() =>
                                    navigation.navigate('CategoriesHome')
                                }
                            >
                                <View className="flex-row items-center">
                                    <Feather
                                        name="x"
                                        size={16}
                                        color="#94A3B8"
                                    />

                                    <Text className="text-[#94A3B8] tracking-[2px] font-headingRegular text-[16px] ml-2">
                                        ABORT
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            {/* COMMIT */}
                            <TouchableOpacity
                                className="flex-1 bg-primary-200 py-4 items-center ml-2"
                                onPress={formik.handleSubmit}
                            >
                                <View className="flex-row items-center">
                                    <Feather
                                        name="check-circle"
                                        size={16}
                                        color="#001A41"
                                    />

                                    <Text className="text-black tracking-[2px] font-headingRegular text-[16px] ml-2">
                                        COMMIT
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <CustomLoader visible={isLoading} />
            </View>
        </>
    )
}
