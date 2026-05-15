import { Feather } from '@expo/vector-icons'
import { useFormik } from 'formik'
import React, { useCallback, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import * as Yup from 'yup'
import { useFocusEffect } from '@react-navigation/core'

import CustomDropdown from '@/components/shared/CustomDropdown'
import CustomLoader from '@/components/shared/CustomLoader'
import FormTextInput from '@/components/shared/FormTextInput'
import Header from '@/components/shared/Header'
import { INITIAL_VALUES } from '@/constants/formvalues'
import useGetCategories from '@/hooks/main/categories/useGetCategories'
import useAddCollectionItem from '@/hooks/main/collections/useAddCollectionItem'
import LoaderStore from '@/stores/LoaderStore'

const months = [
    { value: '01', key: '01' },
    { value: '02', key: '02' },
    { value: '03', key: '03' },
    { value: '04', key: '04' },
    { value: '05', key: '05' },
    { value: '06', key: '06' },
    { value: '07', key: '07' },
    { value: '08', key: '08' },
    { value: '09', key: '09' },
    { value: '10', key: '10' },
    { value: '11', key: '11' },
    { value: '12', key: '12' },
]

const days = Array.from({ length: 31 }, (_, i) => {
    const value = String(i + 1).padStart(2, '0')

    return {
        value: value,
        key: value,
    }
})

const years = Array.from({ length: 20 }, (_, i) => {
    const value = String(2024 + i)

    return {
        value: value,
        key: value,
    }
})

export default function DashboardCollectionAddScreen({ route, navigation }) {
    const isLoading = LoaderStore((state) => state.isLoading)
    const startLoading = LoaderStore((state) => state.startLoading)
    const stopLoading = LoaderStore((state) => state.stopLoading)

    const { categories, fetchCategories } = useGetCategories()
    const categoryOptions =
        categories?.map((category) => ({
            value: category.name,
            key: String(category.id),
        })) || []
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [categoryError, setCategoryError] = useState('')

    const [month, setMonth] = useState('01')
    const [day, setDay] = useState('01')
    const [year, setYear] = useState('2025')
    const [monthError, setMonthError] = useState('')
    const [dayError, setDayError] = useState('')
    const [yearError, setYearError] = useState('')

    const { addCollectionItem } = useAddCollectionItem()
    // Handle formik form submission
    const handleFormikSubmit = async (values, { resetForm }) => {
        startLoading()
        let hasError = false

        if (!selectedCategory) {
            stopLoading()
            setCategoryError('Please select a category')
            hasError = true
        }

        if (!month) {
            stopLoading()
            setMonthError('Required')
            hasError = true
        }

        if (!day) {
            stopLoading()
            setDayError('Required')
            hasError = true
        }

        if (!year) {
            stopLoading()
            setYearError('Required')
            hasError = true
        }

        if (hasError) return

        // Add collection item
        addCollectionItem(
            {
                name: values.collectionName,
                series: values.collectionSeries,
                category: selectedCategory,
                procurement_date: `${month}/${day}/${year}`,
            },
            resetForm,
            navigation
        )
    }

    // Formik configuration
    const formik = useFormik({
        initialValues: INITIAL_VALUES.COLLECTION,
        onSubmit: handleFormikSubmit,
        validationSchema: Yup.object().shape({
            collectionName: Yup.string()
                .min(2, 'Name must be at least 2 characters')
                .max(50, 'Name must not exceed 50 characters')
                .required('Collection item name is required'),
            collectionSeries: Yup.string()
                .min(2, 'Series must be at least 2 characters')
                .max(50, 'Series must not exceed 50 characters')
                .required('Collection series is required'),
        }),
    })

    useFocusEffect(
        useCallback(() => {
            console.log('Mount Dashboard Collection Add')
            fetchCategories()

            return () => {
                console.log('Unmount Dashboard Collection Add')
            }
        }, [])
    )

    const handleBackNavigation = () => {
        const newKey = Math.random().toString()
        navigation.navigate('DashboardHome')
    }

    return (
        <>
            <Header title="INIT_NEW_ENTRY" />
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
                            KIT_REGISTRY_CREATE
                        </Text>

                        <Text className="text-[#94A3B8] text-[16px] leading-6 mt-4 font-body">
                            Input technical specifications for the new unit.
                            Ensure all nomenclature matches manufacturer
                            documentation for database integrity.
                        </Text>

                        {/* READ TAP */}
                        <TouchableOpacity className="mt-5 flex-row items-center">
                            <View className="w-4 h-4 border border-primary-300 items-center justify-center mr-2">
                                <View className="w-2 h-2 bg-primary-300" />
                            </View>
                            <Text className="text-primary-200 text-[12px] font-bodyMedium">
                                READ TAP INPUT...
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* SYSTEM NOTE */}
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
                                    Manual verification of component tasks is
                                    required before commit.
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* FORM PANEL */}
                    <View className="bg-[#2D3339] py-2 px-6 flex-row justify-between">
                        <Text className="text-[13px] font-headingBold text-white">
                            SPECIFICATION_FIELDS
                        </Text>
                        {/* <Text className="text-[13px] font-medium text-[#64748B]">
                            ID: TMP-4492
                        </Text> */}
                    </View>
                    <View className="border border-[#1E293B] bg-[#1A1C1E] p-6">
                        {/* INPUTS */}
                        <FormTextInput
                            inputProps={{
                                placeholder: 'e.g. RX-78-2 GUNDAM',
                                onChangeText:
                                    formik.handleChange('collectionName'),
                                value: formik.values.collectionName,
                            }}
                            label="DESIGNATION NAME"
                            hasStatus={true}
                            statusText={
                                formik.errors.collectionName &&
                                formik.touched.collectionName &&
                                formik.errors.collectionName
                            }
                        />

                        <FormTextInput
                            inputProps={{
                                placeholder: 'e.g. GUNDAM',
                                onChangeText:
                                    formik.handleChange('collectionSeries'),
                                value: formik.values.collectionSeries,
                            }}
                            label="SERIES IDENTIFIER"
                            hasStatus={true}
                            statusText={
                                formik.errors.collectionSeries &&
                                formik.touched.collectionSeries &&
                                formik.errors.collectionSeries
                            }
                        />

                        <CustomDropdown
                            label="SYSTEM CATEGORY"
                            selectedValue={selectedCategory}
                            onValueChange={(value) =>
                                setSelectedCategory(value)
                            }
                            data={categoryOptions}
                            errorMessage={categoryError}
                        />

                        {/* PROCUREMENT DATE */}
                        <Text className="text-[12px] text-[#64748B] tracking-[2px] font-headingBold mb-2">
                            PROCUREMENT DATE
                        </Text>

                        <View className="flex-row justify-between">
                            <View className="w-[32%]">
                                <CustomDropdown
                                    label=""
                                    selectedValue={month}
                                    onValueChange={setMonth}
                                    data={months}
                                    errorMessage={monthError}
                                />
                            </View>

                            <View className="w-[32%]">
                                <CustomDropdown
                                    label=""
                                    selectedValue={day}
                                    onValueChange={setDay}
                                    data={days}
                                    errorMessage={dayError}
                                />
                            </View>

                            <View className="w-[32%]">
                                <CustomDropdown
                                    label=""
                                    selectedValue={year}
                                    onValueChange={setYear}
                                    data={years}
                                    errorMessage={yearError}
                                />
                            </View>
                        </View>
                        {/* FOOTER BUTTONS */}
                        <View className="flex-row mt-8">
                            {/* ABORT */}
                            <TouchableOpacity
                                className="flex-1 border border-neutral-700 py-4 items-center mr-2"
                                onPress={handleBackNavigation}
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
