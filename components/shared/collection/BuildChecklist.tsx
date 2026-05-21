import { updateSubtaskStatus } from '@/backend/collections/subtasks'
import useDeleteSubtask from '@/hooks/main/subtasks/useDeleteSubtask'
import useUpdateSubtask from '@/hooks/main/subtasks/useUpdateSubtask'
import useDeleteTask from '@/hooks/main/tasks/useDeleteTask'
import useUpdateTask from '@/hooks/main/tasks/useUpdateTask'
import { Feather } from '@expo/vector-icons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useEffect, useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function BuildChecklist({
    collectionId,
    items,
    updateRefreshKey,
}) {
    const [isEditMode, setIsEditMode] = useState(false)
    console.log('edit', isEditMode)

    const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
    const [taskDraftTitle, setTaskDraftTitle] = useState<string>('')
    const [editingSubtaskId, setEditingSubtaskId] = useState<number | null>(
        null
    )
    const [draftSubtaskTitle, setDraftSubtaskTitle] = useState<string>('')

    useEffect(() => {
        if (!isEditMode) {
            setEditingTaskId(null)
            setEditingSubtaskId(null)
        }
    }, [isEditMode])

    const { updateTaskNameRecord, updateTaskStatusRecord } = useUpdateTask()
    const { deleteTask } = useDeleteTask()
    const { updateSubtaskNameRecord, updateSubtaskStatusRecord } =
        useUpdateSubtask()
    const { deleteSubtask } = useDeleteSubtask()

    const goToNextScreen = () => {
        const newKey = Math.random().toString()
        updateRefreshKey()
    }

    return (
        <View className="border border-[#1E293B] bg-[#1A1C1E] mb-4">
            {/* HEADER */}
            <View className="px-4 py-2 border-b-[#1E293B] bg-[#273647]/30 flex-row justify-between">
                <View className="flex-row items-center">
                    <Text className="text-[12px] text-white tracking-widest font-headingRegular">
                        BUILD_CHECKLIST
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() => setIsEditMode(!isEditMode)}
                    className={`px-3 py-2 border ${
                        isEditMode
                            ? 'border-primary-400 bg-primary-500/10'
                            : 'border-[#334155]'
                    }`}
                >
                    <Feather
                        name={isEditMode ? 'x' : 'edit-2'}
                        size={14}
                        color={isEditMode ? '#ADC6FF' : '#64748B'}
                    />
                </TouchableOpacity>
            </View>

            {/* LIST */}
            <View className="w-full p-4">
                {items.map((item, index) => (
                    <View key={index} className="mb-4">
                        {/* TITLE */}
                        <View className="flex-row items-center mb-2">
                            {/* ICON */}
                            {item.status === 'completed' ? (
                                <Feather
                                    name="check-circle"
                                    size={18}
                                    color="#ADC6FF"
                                />
                            ) : (
                                <MaterialCommunityIcons
                                    name="dots-horizontal-circle-outline"
                                    size={20}
                                    color="#FFB693"
                                />
                            )}

                            {/* TITLE / INPUT */}
                            <View className="flex-1 ml-2">
                                {editingTaskId === item.id ? (
                                    <TextInput
                                        value={taskDraftTitle}
                                        onChangeText={setTaskDraftTitle}
                                        className="text-white border border-[#334155] px-3 py-2"
                                    />
                                ) : (
                                    <Text className="text-white font-headingRegular text-[18px]">
                                        {item.name}
                                    </Text>
                                )}
                            </View>

                            {/* ACTIONS */}
                            {isEditMode && (
                                <View className="flex-row ml-2 items-center">
                                    {editingTaskId === item.id ? (
                                        <TouchableOpacity
                                            onPress={() => {
                                                updateTaskNameRecord(
                                                    item.id,
                                                    taskDraftTitle,
                                                    goToNextScreen
                                                )
                                                setEditingTaskId(null)
                                            }}
                                            className="mr-3"
                                        >
                                            <Text className="text-green-400 text-xs uppercase">
                                                Save
                                            </Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setEditingTaskId(item.id)
                                                setTaskDraftTitle(item.name)
                                            }}
                                            className="mr-3"
                                        >
                                            <Text className="text-blue-300 text-xs uppercase">
                                                Edit
                                            </Text>
                                        </TouchableOpacity>
                                    )}

                                    <TouchableOpacity
                                        onPress={() => {
                                            deleteTask(item.id, goToNextScreen)
                                            setEditingTaskId(null)
                                        }}
                                    >
                                        <Text className="text-red-400 text-xs uppercase">
                                            Delete
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        <View className="w-full relative pl-6">
                            {/* LEFT INDENT LINE */}
                            <View className="absolute left-0 top-0 bottom-0 w-[1px] bg-[#64748B]" />

                            {/* SUBTASKS */}
                            {item.status !== 'completed'
                                ? item.subtasks?.map((sub, i) => (
                                      <View
                                          key={i}
                                          className="p-4 mb-2 bg-[#0F1113]"
                                      >
                                          {/* TOP ROW */}
                                          <View className="flex-row items-center justify-between">
                                              {/* TITLE */}
                                              <View className="flex-1 flex-row items-center">
                                                  {editingSubtaskId ===
                                                  sub.id ? (
                                                      <TextInput
                                                          value={
                                                              draftSubtaskTitle
                                                          }
                                                          onChangeText={
                                                              setDraftSubtaskTitle
                                                          }
                                                          className="flex-1 text-[#CBD5E1]"
                                                      />
                                                  ) : (
                                                      <Text className="flex-1 text-[#CBD5E1]">
                                                          {sub.name}
                                                      </Text>
                                                  )}
                                              </View>

                                              {/* ACTIONS (edit mode only) */}
                                              {isEditMode ? (
                                                  <View className="flex-row ml-2 items-center">
                                                      {editingSubtaskId ===
                                                      sub.id ? (
                                                          <TouchableOpacity
                                                              onPress={() => {
                                                                  updateSubtaskNameRecord(
                                                                      sub.id,
                                                                      draftSubtaskTitle,
                                                                      goToNextScreen
                                                                  )
                                                                  setEditingSubtaskId(
                                                                      null
                                                                  )
                                                              }}
                                                              className="mr-3"
                                                          >
                                                              <Text className="text-green-400 text-[10px] uppercase">
                                                                  Save
                                                              </Text>
                                                          </TouchableOpacity>
                                                      ) : (
                                                          <TouchableOpacity
                                                              onPress={() => {
                                                                  setEditingSubtaskId(
                                                                      sub.id
                                                                  )
                                                                  setDraftSubtaskTitle(
                                                                      sub.name
                                                                  )
                                                              }}
                                                              className="mr-3"
                                                          >
                                                              <Text className="text-blue-300 text-[10px] uppercase">
                                                                  Edit
                                                              </Text>
                                                          </TouchableOpacity>
                                                      )}

                                                      <TouchableOpacity
                                                          onPress={() => {
                                                              deleteSubtask(
                                                                  sub.id,
                                                                  goToNextScreen
                                                              )
                                                              setEditingSubtaskId(
                                                                  null
                                                              )
                                                          }}
                                                      >
                                                          <Text className="text-red-400 text-[10px] uppercase">
                                                              Delete
                                                          </Text>
                                                      </TouchableOpacity>
                                                  </View>
                                              ) : (
                                                  <Text className="text-[11px] text-[#64748B] uppercase">
                                                      {sub.status}
                                                  </Text>
                                              )}
                                          </View>

                                          {/* STATUS ROW */}
                                          <View className="flex-row items-center mt-2">
                                              {/* EDIT MODE */}
                                              {isEditMode && (
                                                  <View className="flex-row">
                                                      {[
                                                          'PENDING',
                                                          'IN_PROGRESS',
                                                          'COMPLETED',
                                                      ].map((status) => {
                                                          const active =
                                                              sub.status ===
                                                              status

                                                          return (
                                                              <TouchableOpacity
                                                                  key={status}
                                                                  onPress={() => {
                                                                      updateSubtaskStatusRecord(
                                                                          collectionId,
                                                                          sub.id,
                                                                          items,
                                                                          status,
                                                                          goToNextScreen
                                                                      )
                                                                  }}
                                                                  className={`px-2 py-1 border mr-1 ${
                                                                      active
                                                                          ? 'border-primary-400 bg-primary-500/10'
                                                                          : 'border-[#334155]'
                                                                  }`}
                                                              >
                                                                  <Text
                                                                      className={`text-[9px] tracking-[1px] ${
                                                                          active
                                                                              ? 'text-primary-200'
                                                                              : 'text-[#64748B]'
                                                                      }`}
                                                                  >
                                                                      {status.replace(
                                                                          '_',
                                                                          ' '
                                                                      )}
                                                                  </Text>
                                                              </TouchableOpacity>
                                                          )
                                                      })}
                                                  </View>
                                              )}
                                          </View>
                                      </View>
                                  ))
                                : item.subtasks?.map((sub, i) => (
                                      <View
                                          key={i}
                                          className="p-4 mb-2 bg-[#0F1113]"
                                      >
                                          {/* TOP ROW */}
                                          <View className="flex-row items-center justify-between">
                                              {/* TITLE */}
                                              <View className="flex-1 flex-row items-center">
                                                  {editingSubtaskId ===
                                                  sub.id ? (
                                                      <TextInput
                                                          value={
                                                              draftSubtaskTitle
                                                          }
                                                          onChangeText={
                                                              setDraftSubtaskTitle
                                                          }
                                                          className="flex-1 text-[#CBD5E1]"
                                                      />
                                                  ) : (
                                                      <Text className="flex-1 text-[#CBD5E1]">
                                                          {sub.name}
                                                      </Text>
                                                  )}
                                              </View>

                                              {/* ACTIONS (edit mode only) */}
                                              {isEditMode && (
                                                  <View className="flex-row ml-2 items-center">
                                                      {editingSubtaskId ===
                                                      sub.id ? (
                                                          <TouchableOpacity
                                                              onPress={() => {
                                                                  updateSubtaskNameRecord(
                                                                      sub.id,
                                                                      draftSubtaskTitle,
                                                                      goToNextScreen
                                                                  )
                                                                  setEditingSubtaskId(
                                                                      null
                                                                  )
                                                              }}
                                                              className="mr-3"
                                                          >
                                                              <Text className="text-green-400 text-[10px] uppercase">
                                                                  Save
                                                              </Text>
                                                          </TouchableOpacity>
                                                      ) : (
                                                          <TouchableOpacity
                                                              onPress={() => {
                                                                  setEditingSubtaskId(
                                                                      sub.id
                                                                  )
                                                                  setDraftSubtaskTitle(
                                                                      sub.name
                                                                  )
                                                              }}
                                                              className="mr-3"
                                                          >
                                                              <Text className="text-blue-300 text-[10px] uppercase">
                                                                  Edit
                                                              </Text>
                                                          </TouchableOpacity>
                                                      )}

                                                      <TouchableOpacity
                                                          onPress={() => {
                                                              deleteSubtask(
                                                                  sub.id,
                                                                  goToNextScreen
                                                              )
                                                              setEditingSubtaskId(
                                                                  null
                                                              )
                                                          }}
                                                      >
                                                          <Text className="text-red-400 text-[10px] uppercase">
                                                              Delete
                                                          </Text>
                                                      </TouchableOpacity>
                                                  </View>
                                              )}
                                          </View>

                                          {/* STATUS ROW */}
                                          <View className="flex-row items-center mt-2">
                                              {/* VIEW MODE */}
                                              {!isEditMode && (
                                                  <Text className="text-[11px] text-[#64748B] uppercase">
                                                      {sub.status?.replace(
                                                          '_',
                                                          ' '
                                                      )}
                                                  </Text>
                                              )}

                                              {/* EDIT MODE */}
                                              {isEditMode && (
                                                  <View className="flex-row">
                                                      {[
                                                          'PENDING',
                                                          'IN_PROGRESS',
                                                          'COMPLETED',
                                                      ].map((status) => {
                                                          const active =
                                                              sub.status ===
                                                              status

                                                          return (
                                                              <TouchableOpacity
                                                                  key={status}
                                                                  onPress={() => {
                                                                      updateSubtaskStatusRecord(
                                                                          collectionId,
                                                                          sub.id,
                                                                          items,
                                                                          status,
                                                                          goToNextScreen
                                                                      )
                                                                  }}
                                                                  className={`px-2 py-1 border mr-1 ${
                                                                      active
                                                                          ? 'border-primary-400 bg-primary-500/10'
                                                                          : 'border-[#334155]'
                                                                  }`}
                                                              >
                                                                  <Text
                                                                      className={`text-[9px] tracking-[1px] ${
                                                                          active
                                                                              ? 'text-primary-200'
                                                                              : 'text-[#64748B]'
                                                                      }`}
                                                                  >
                                                                      {status.replace(
                                                                          '_',
                                                                          ' '
                                                                      )}
                                                                  </Text>
                                                              </TouchableOpacity>
                                                          )
                                                      })}
                                                  </View>
                                              )}
                                          </View>
                                      </View>
                                  ))}
                            {item.status === 'COMPLETED' && (
                                <Text className="text-primary-400]">
                                    TASK_COMPLETED {item.completed_at}
                                </Text>
                            )}
                        </View>
                    </View>
                ))}
            </View>
        </View>
    )
}
