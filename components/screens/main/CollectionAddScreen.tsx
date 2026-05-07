import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Feather, MaterialIcons } from '@expo/vector-icons'

import Header from '@/components/shared/Header'
import FormTextInput from '@/components/shared/FormTextInput'
import CustomDropdown from '@/components/shared/CustomDropdown'

const SYSTEM_CATEGORIES = [
    { label: 'Gunpla', key: 'gunpla' },
    { label: 'LEGO', key: 'lego' },
    { label: 'Kotobukiya', key: 'kotobukiya' },
    { label: 'Warhammer', key: 'warhammer' },
    { label: 'Transformers', key: 'transformers' },
    { label: 'Zoids', key: 'zoids' },
    { label: 'Mecha Musume', key: 'mecha-musume' },
]

const months = [
    { label: '01', key: '01' },
    { label: '02', key: '02' },
    { label: '03', key: '03' },
    { label: '04', key: '04' },
    { label: '05', key: '05' },
    { label: '06', key: '06' },
    { label: '07', key: '07' },
    { label: '08', key: '08' },
    { label: '09', key: '09' },
    { label: '10', key: '10' },
    { label: '11', key: '11' },
    { label: '12', key: '12' },
]

const days = Array.from({ length: 31 }, (_, i) => {
    const value = String(i + 1).padStart(2, '0')

    return {
        label: value,
        key: value,
    }
})

const years = Array.from({ length: 20 }, (_, i) => {
    const value = String(2024 + i)

    return {
        label: value,
        key: value,
    }
})

export default function CollectionAddScreen() {
    const [designation, setDesignation] = useState('')
    const [series, setSeries] = useState('')
    const [category, setCategory] = useState('Gunpla')

    const [month, setMonth] = useState('01')
    const [day, setDay] = useState('01')
    const [year, setYear] = useState('2025')

    const [tasks, setTasks] = useState([
        {
            title: '',
            subtasks: [''],
        },
    ])

    const addTask = () => {
        setTasks((prev) => [
            ...prev,
            {
                title: '',
                subtasks: [''],
            },
        ])
    }

    const removeTask = (taskIndex: number) => {
        setTasks((prev) => prev.filter((_, i) => i !== taskIndex))
    }

    const addSubtask = (taskIndex: number) => {
        setTasks((prev) =>
            prev.map((task, i) =>
                i === taskIndex
                    ? {
                          ...task,
                          subtasks: [...task.subtasks, ''],
                      }
                    : task
            )
        )
    }

    const removeSubtask = (taskIndex: number, subtaskIndex: number) => {
        setTasks((prev) =>
            prev.map((task, i) => {
                if (i !== taskIndex) return task

                if (task.subtasks.length <= 1) return task

                return {
                    ...task,
                    subtasks: task.subtasks.filter(
                        (_, s) => s !== subtaskIndex
                    ),
                }
            })
        )
    }

    return (
        <>
            <Header title="INIT_NEW_ENTRY" />
            <View className="flex-1 bg-[#0F1113] p-4">
                <ScrollView>
                    {/* HERO PANEL */}
                    <View className="border border-neutral-800 bg-background-200 p-4 mt-4">
                        <Text className="text-[10px] tracking-[2px] text-[#64748B] font-headingRegular">
                            PROTOCOL_DATA_ENTRY
                        </Text>

                        <Text className="text-[36px] text-white font-headingBold mt-4 leading-[42px]">
                            KIT_REGISTRY_CREATE
                        </Text>

                        <Text className="text-[#94A3B8] text-[14px] leading-6 mt-4 font-body">
                            Input technical specifications for the new unit.
                            Ensure all nomenclature matches manufacturer
                            documentation for database integrity.
                        </Text>

                        {/* READ TAP */}
                        <TouchableOpacity className="mt-5 flex-row items-center">
                            <View className="w-4 h-4 border border-primary-300 items-center justify-center mr-2">
                                <View className="w-2 h-2 bg-primary-300" />
                            </View>

                            <Text className="text-primary-300 text-[12px] tracking-[2px]">
                                READ TAP INPUT...
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* SYSTEM NOTE */}
                    <View className="mt-4 border border-neutral-800 bg-background-200 p-4">
                        <View className="flex-row items-start">
                            <View className="w-5 h-5 rounded-full border border-primary-300 items-center justify-center mr-3 mt-[2px]">
                                <Text className="text-primary-300 text-[10px]">
                                    !
                                </Text>
                            </View>

                            <View className="flex-1">
                                <Text className="text-[11px] tracking-[2px] text-[#64748B]">
                                    SYSTEM NOTE
                                </Text>

                                <Text className="text-[13px] text-[#CBD5E1] mt-2 leading-5">
                                    Manual verification of component quantity is
                                    required before commit.
                                </Text>
                            </View>

                            <Text className="text-[10px] text-[#64748B]">
                                ID: TMP-4492
                            </Text>
                        </View>
                    </View>

                    {/* FORM PANEL */}
                    <View className="mt-4 border border-neutral-800 bg-background-200 p-4">
                        <Text className="text-[10px] tracking-[2px] text-[#64748B] mb-5">
                            SPECIFICATION_FIELDS
                        </Text>

                        {/* INPUTS */}
                        <FormTextInput
                            label="DESIGNATION NAME"
                            value={designation}
                            onChangeText={setDesignation}
                            placeholder="e.g. RX-78-2 GUNDAM"
                        />

                        <FormTextInput
                            label="SERIES IDENTIFIER"
                            value={series}
                            onChangeText={setSeries}
                            placeholder="MOBILE SUIT GUNDAM"
                        />

                        <CustomDropdown
                            label="SYSTEM CATEGORY"
                            selectedValue={category}
                            onValueChange={setCategory}
                            items={SYSTEM_CATEGORIES}
                        />

                        {/* PROCUREMENT DATE */}
                        <Text className="text-[10px] text-[#64748B] tracking-[2px] mb-2 mt-4">
                            PROCUREMENT DATE
                        </Text>

                        <View className="flex-row justify-between">
                            <View className="w-[32%]">
                                <CustomDropdown
                                    label=""
                                    selectedValue={month}
                                    onValueChange={setMonth}
                                    items={months}
                                />
                            </View>

                            <View className="w-[32%]">
                                <CustomDropdown
                                    label=""
                                    selectedValue={day}
                                    onValueChange={setDay}
                                    items={days}
                                />
                            </View>

                            <View className="w-[32%]">
                                <CustomDropdown
                                    label=""
                                    selectedValue={year}
                                    onValueChange={setYear}
                                    items={years}
                                />
                            </View>
                        </View>

                        {/* TASKS */}
                        <View className="mt-6">
                            <Text className="text-[10px] text-[#64748B] tracking-[2px] mb-4">
                                TASK CONFIGURATION
                            </Text>

                            {tasks.map((task, taskIndex) => (
                                <View
                                    key={taskIndex}
                                    className="border border-neutral-800 bg-[#090C11] p-4 mb-4"
                                >
                                    {/* TASK TITLE */}
                                    <FormTextInput
                                        label={`TASK ${taskIndex + 1}`}
                                        value={task.title}
                                        onChangeText={(text) => {
                                            const updated = [...tasks]
                                            updated[taskIndex].title = text
                                            setTasks(updated)
                                        }}
                                        placeholder="ENTER TASK NAME"
                                    />

                                    {/* SUBTASKS */}
                                    {task.subtasks.map((subtask, subIndex) => (
                                        <View
                                            key={subIndex}
                                            className="flex-row items-center"
                                        >
                                            <View className="flex-1">
                                                <FormTextInput
                                                    label={`SUBTASK ${
                                                        subIndex + 1
                                                    }`}
                                                    value={subtask}
                                                    onChangeText={(text) => {
                                                        const updated = [
                                                            ...tasks,
                                                        ]

                                                        updated[
                                                            taskIndex
                                                        ].subtasks[subIndex] =
                                                            text

                                                        setTasks(updated)
                                                    }}
                                                    placeholder="ENTER SUBTASK"
                                                />
                                            </View>

                                            {/* REMOVE SUBTASK */}
                                            <TouchableOpacity
                                                onPress={() =>
                                                    removeSubtask(
                                                        taskIndex,
                                                        subIndex
                                                    )
                                                }
                                                className="ml-2 border border-red-500 px-4 py-4"
                                            >
                                                <Feather
                                                    name="trash-2"
                                                    size={16}
                                                    color="#F87171"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    ))}

                                    {/* ACTIONS */}
                                    <View className="flex-row justify-between mt-3">
                                        {/* ADD SUBTASK */}
                                        <TouchableOpacity
                                            onPress={() =>
                                                addSubtask(taskIndex)
                                            }
                                            className="flex-row items-center border border-primary-500 px-4 py-3"
                                        >
                                            <Feather
                                                name="plus"
                                                size={14}
                                                color="#ADC6FF"
                                            />

                                            <Text className="text-primary-300 text-[11px] tracking-[2px] ml-2">
                                                ADD SUBTASK
                                            </Text>
                                        </TouchableOpacity>

                                        {/* REMOVE TASK */}
                                        <TouchableOpacity
                                            onPress={() =>
                                                removeTask(taskIndex)
                                            }
                                            className="flex-row items-center border border-red-500 px-4 py-3"
                                        >
                                            <Feather
                                                name="trash-2"
                                                size={14}
                                                color="#F87171"
                                            />

                                            <Text className="text-red-400 text-[11px] tracking-[2px] ml-2">
                                                REMOVE
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}

                            {/* ADD TASK */}
                            <TouchableOpacity
                                onPress={addTask}
                                className="border border-primary-500 py-4 items-center"
                            >
                                <View className="flex-row items-center">
                                    <Feather
                                        name="plus-circle"
                                        size={16}
                                        color="#ADC6FF"
                                    />

                                    <Text className="text-primary-300 tracking-[2px] text-[11px] ml-2">
                                        ADD TASK
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* FOOTER BUTTONS */}
                        <View className="flex-row mt-8">
                            {/* ABORT */}
                            <TouchableOpacity className="flex-1 border border-neutral-700 py-4 items-center mr-2">
                                <View className="flex-row items-center">
                                    <Feather
                                        name="x"
                                        size={16}
                                        color="#94A3B8"
                                    />

                                    <Text className="text-[#94A3B8] tracking-[2px] ml-2">
                                        ABORT
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            {/* COMMIT */}
                            <TouchableOpacity className="flex-1 bg-primary-200 py-4 items-center ml-2">
                                <View className="flex-row items-center">
                                    <Feather
                                        name="check-circle"
                                        size={16}
                                        color="#001A41"
                                    />

                                    <Text className="text-black tracking-[2px] font-label ml-2">
                                        COMMIT
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </>
    )
}
