import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Feather, MaterialIcons } from '@expo/vector-icons'

import Header from '@/components/shared/Header'
import FormTextInput from '@/components/shared/FormTextInput'

export default function TaskAddScreen({ route, navigation }) {
    const params = route.params
    const [tasks, setTasks] = useState<any>([])

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

    const handleBackNavigation = () => {
        if (params.from === 'collection-add') {
            navigation.navigate('DashboardHome')
        } else {
            navigation.navigate('CollectionEdit')
        }
    }
    return (
        <>
            <Header title="INIT_NEW_ENTRY" />
            <View className="flex-1 bg-[#0F1113] p-4">
                <View className="border border-[#1E293B] bg-[#1A1C1E] p-4">
                    <View className="w-[48%] bg-[#1E293B]/50 p-2">
                        <Text className="text-[11px] tracking-[2px] text-primary-200 font-headingRegular">
                            PROTOCOL_DATA_ENTRY
                        </Text>
                    </View>

                    <Text className="text-[32px] text-white font-headingBold mt-4">
                        KIT_TASK_CREATE
                    </Text>

                    <Text className="text-[#94A3B8] text-[16px] leading-6 mt-4 font-body">
                        Input tasks for the new unit. Ensure all nomenclature
                        matches manufacturer documentation for database
                        integrity.
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
                <View className="mt-4 border border-[#1E293B] bg-[#1A1C1E] p-4">
                    <View className="mb-4">
                        <Text className="text-[12px] text-[#64748B] tracking-[2px] font-headingBold mb-2">
                            TASK CONFIGURATION
                        </Text>
                        {tasks.length === 0 ? (
                            <View className="border border-dashed border-[#1E293B] py-10 items-center justify-center mb-4">
                                <Feather
                                    name="clipboard"
                                    size={28}
                                    color="#64748B"
                                />

                                <Text className="text-[#64748B] text-[14px] tracking-[2px] font-headingBold mt-4 mb-1">
                                    NO TASKS CONFIGURED
                                </Text>

                                <Text className="text-[#64748B] text-[12px] font-body mb-4">
                                    Add a task to initialize workflow
                                </Text>

                                {/* ADD TASK */}
                                <TouchableOpacity
                                    onPress={addTask}
                                    className="border border-primary-200 p-4 items-center"
                                >
                                    <View className="flex-row items-center">
                                        <Feather
                                            name="plus-circle"
                                            size={20}
                                            color="#ADC6FF"
                                        />

                                        <Text className="text-white tracking-[2px] text-[12px] font-headingRegular ml-2">
                                            ADD TASK
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            tasks.map((task, taskIndex) => (
                                <View key={taskIndex} className="mb-4">
                                    {/* TASK TITLE */}
                                    <FormTextInput
                                        value={`TASK ${taskIndex + 1}`}
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
                                                    value={`SUBTASK ${
                                                        subIndex + 1
                                                    }`}
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
                                                className="ml-2 border border-red-500 p-3 mb-4"
                                            >
                                                <Feather
                                                    name="trash-2"
                                                    size={18}
                                                    color="#F87171"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    ))}

                                    {/* ACTIONS */}
                                    <View className="flex-row justify-between">
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

                                            <Text className="text-primary-200 text-[12px] font-headingRegular tracking-[2px] ml-2">
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

                                            <Text className="text-red-400 text-[12px] font-headingRegular tracking-[2px] ml-2">
                                                CANCEL
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))
                        )}
                    </View>

                    {/* FOOTER BUTTONS */}
                    <View className="flex-row mt-8">
                        {/* ABORT */}
                        <TouchableOpacity
                            className="flex-1 border border-neutral-700 py-4 items-center mr-2"
                            onPress={handleBackNavigation}
                        >
                            <View className="flex-row items-center">
                                <Feather name="x" size={16} color="#94A3B8" />

                                <Text className="text-[#94A3B8] tracking-[2px] font-headingRegular text-[16px] ml-2">
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

                                <Text className="text-black tracking-[2px] font-headingRegular text-[16px] ml-2">
                                    COMMIT
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    )
}
