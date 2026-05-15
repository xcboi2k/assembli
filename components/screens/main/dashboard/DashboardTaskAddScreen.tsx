import React, { useCallback, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Feather } from '@expo/vector-icons'

import Header from '@/components/shared/Header'
import FormTextInput from '@/components/shared/FormTextInput'
import CustomLoader from '@/components/shared/CustomLoader'
import LoaderStore from '@/stores/LoaderStore'
import useAddTaskWithSubtasks from '@/hooks/main/useAddTasksWithSubTasks'
import { useFocusEffect } from '@react-navigation/core'

type Subtask = {
    id: string
    title: string
}

type Task = {
    id: string
    title: string
    subtasks: Subtask[]
}

export default function DashboardTaskAddScreen({ route, navigation }) {
    const params = route.params
    console.log('task add params:', params)

    const isLoading = LoaderStore((state) => state.isLoading)

    const taskIdCounter = useRef(0)
    const subtaskIdCounter = useRef(0)

    const createTaskId = () => `task-${taskIdCounter.current++}`
    const createSubtaskId = () => `subtask-${subtaskIdCounter.current++}`

    const [tasks, setTasks] = useState<Task[]>([])
    console.log('tasks', JSON.stringify(tasks, null, 2))

    useFocusEffect(
        useCallback(() => {
            // reset every time screen is opened
            setTasks([])
            taskIdCounter.current = 0
            subtaskIdCounter.current = 0

            console.log('Mount Dashboard Task Add')
            return () => {
                console.log('Unmount Dashboard Task Add')
            }
        }, [])
    )

    const { addTasksWithSubtasks } = useAddTaskWithSubtasks()
    const handleSubmitTasks = async () => {
        const payload = {
            collection_id: params.item.id,
            tasks: tasks.map((task) => ({
                title: task.title,
                subtasks: task.subtasks.map((st) => ({
                    title: st.title,
                })),
            })),
        }

        await addTasksWithSubtasks(payload, () =>
            navigation.navigate('DashboardHome')
        )
    }

    const handleBackNavigation = () => {
        navigation.navigate('DashboardHome')
    }

    return (
        <>
            <Header title="INIT_NEW_ENTRY" />

            <View className="flex-1 bg-[#0F1113] p-4">
                <ScrollView>
                    {/* HEADER CARD */}
                    <View className="border border-[#1E293B] bg-[#1A1C1E] p-4">
                        <Text className="text-[32px] text-white font-headingBold mt-4">
                            KIT_TASK_CREATE
                        </Text>

                        <Text className="text-[#94A3B8] text-[16px] leading-6 mt-4 font-body">
                            Input tasks for the new unit.
                        </Text>

                        <TouchableOpacity className="mt-5 flex-row items-center">
                            <View className="w-4 h-4 border border-primary-300 items-center justify-center mr-2">
                                <View className="w-2 h-2 bg-primary-300" />
                            </View>

                            <Text className="text-primary-200 text-[12px] font-bodyMedium">
                                READ TAP INPUT...
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* TASK SECTION */}
                    <View className="mt-4 border border-[#1E293B] bg-[#1A1C1E] p-4">
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

                                <Text className="text-[#64748B] mt-4 text-[14px]">
                                    NO TASKS CONFIGURED
                                </Text>
                            </View>
                        ) : (
                            tasks.map((task, taskIndex) => (
                                <View key={task.id} className="mb-6">
                                    {/* TASK INPUT */}
                                    <FormTextInput
                                        inputProps={{
                                            placeholder: `TASK ${taskIndex + 1}`,
                                            onChangeText: (text) => {
                                                setTasks((prev) =>
                                                    prev.map((t) =>
                                                        t.id === task.id
                                                            ? {
                                                                  ...t,
                                                                  title: text,
                                                              }
                                                            : t
                                                    )
                                                )
                                            },
                                            value: task.title,
                                        }}
                                    />

                                    {/* SUBTASKS */}
                                    {task.subtasks.map((subtask, subIndex) => (
                                        <View
                                            key={subtask.id}
                                            className="flex-row items-center"
                                        >
                                            <View className="flex-1">
                                                <FormTextInput
                                                    inputProps={{
                                                        placeholder: `SUBTASK ${subIndex + 1}`,
                                                        onChangeText: (
                                                            text
                                                        ) => {
                                                            setTasks((prev) =>
                                                                prev.map(
                                                                    (t) => {
                                                                        if (
                                                                            t.id !==
                                                                            task.id
                                                                        )
                                                                            return t

                                                                        return {
                                                                            ...t,
                                                                            subtasks:
                                                                                t.subtasks.map(
                                                                                    (
                                                                                        s
                                                                                    ) =>
                                                                                        s.id ===
                                                                                        subtask.id
                                                                                            ? {
                                                                                                  ...s,
                                                                                                  title: text,
                                                                                              }
                                                                                            : s
                                                                                ),
                                                                        }
                                                                    }
                                                                )
                                                            )
                                                        },
                                                        value: subtask.title,
                                                    }}
                                                />
                                            </View>

                                            <TouchableOpacity
                                                onPress={() => {
                                                    setTasks((prev) =>
                                                        prev.map((t) =>
                                                            t.id === task.id
                                                                ? {
                                                                      ...t,
                                                                      subtasks:
                                                                          t.subtasks.filter(
                                                                              (
                                                                                  s
                                                                              ) =>
                                                                                  s.id !==
                                                                                  subtask.id
                                                                          ),
                                                                  }
                                                                : t
                                                        )
                                                    )
                                                }}
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
                                        <TouchableOpacity
                                            onPress={() => {
                                                setTasks((prev) =>
                                                    prev.map((t) =>
                                                        t.id === task.id
                                                            ? {
                                                                  ...t,
                                                                  subtasks: [
                                                                      ...t.subtasks,
                                                                      {
                                                                          id: createSubtaskId(),
                                                                          title: '',
                                                                      },
                                                                  ],
                                                              }
                                                            : t
                                                    )
                                                )
                                            }}
                                            className="border border-primary-500 px-4 py-3"
                                        >
                                            <Text className="text-primary-200">
                                                ADD SUBTASK
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => {
                                                setTasks((prev) =>
                                                    prev.filter(
                                                        (t) => t.id !== task.id
                                                    )
                                                )
                                            }}
                                            className="border border-red-500 px-4 py-3"
                                        >
                                            <Text className="text-red-400">
                                                REMOVE TASK
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))
                        )}
                        <View className="w-full border-b border-white mb-4 mt-4" />
                        <TouchableOpacity
                            onPress={() =>
                                setTasks([
                                    ...tasks,
                                    {
                                        id: createTaskId(),
                                        title: '',
                                        subtasks: [],
                                    },
                                ])
                            }
                            className="mt-4 border border-primary-200 p-4 items-center justify-center"
                        >
                            <Text className="text-white">ADD TASK</Text>
                        </TouchableOpacity>

                        {/* FOOTER */}
                        <View className="flex-row mt-8">
                            <TouchableOpacity
                                className="flex-1 border border-neutral-700 py-4 items-center mr-2"
                                onPress={handleBackNavigation}
                            >
                                <Text className="text-[#94A3B8]">ABORT</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="flex-1 bg-primary-200 py-4 items-center ml-2"
                                onPress={handleSubmitTasks}
                            >
                                <Text className="text-black">COMMIT</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                <CustomLoader visible={isLoading} />
            </View>
        </>
    )
}
