import { View, Text } from 'react-native'
import { Feather } from '@expo/vector-icons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

export default function BuildChecklist({ items }) {
    return (
        <View className="border border-[#1E293B] bg-[#1A1C1E] mb-6">
            {/* HEADER */}
            <View className="px-4 py-2 border-b-[#1E293B] bg-[#273647]/30 flex-row justify-between">
                <Text className="text-[12px] text-white tracking-widest font-headingRegular">
                    BUILD_CHECKLIST
                </Text>
                <MaterialIcons name="checklist" size={20} color="#64748B" />
            </View>

            {/* LIST */}
            <View className="w-full p-4">
                {items.map((item, index) => (
                    <View key={index} className="mb-4">
                        {/* TITLE */}
                        <View className="flex-row items-center mb-2">
                            {item.done ? (
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

                            <Text className="ml-2 text-white font-headingRegular text-[18px]">
                                {item.title}
                            </Text>
                        </View>

                        <View className="w-full relative pl-6">
                            {/* LEFT INDENT LINE */}
                            <View className="absolute left-0 top-0 bottom-0 w-[1px] bg-[#64748B]" />

                            {/* SUBTASKS */}
                            {item.done
                                ? item.subtasks?.map((sub, i) => (
                                      <View
                                          key={i}
                                          className="p-4 mb-2 bg-[#0F1113]"
                                      >
                                          <View className="flex-row justify-between items-center">
                                              <Text className="flex-1 text-[16px] text-[#CBD5E1] font-bodyRegular">
                                                  {sub.title}
                                              </Text>

                                              {sub.status && (
                                                  <Text className="text-[11px] text-primary-200 font-bodyRegular ml-2">
                                                      {sub.status}
                                                  </Text>
                                              )}
                                          </View>
                                      </View>
                                  ))
                                : item.subtasks?.map((sub, i) => (
                                      <View
                                          key={i}
                                          className="flex-row items-center mb-2"
                                      >
                                          {/* BOX */}
                                          <View className="w-4 h-4 mr-2 border items-center justify-center border-[#475699]">
                                              {sub.checked && (
                                                  <View className="w-2 h-2 bg-primary-200" />
                                              )}
                                          </View>

                                          {/* TEXT */}
                                          <View className="flex-1 flex-row items-center justify-between">
                                              <Text className="text-[16px] text-white">
                                                  {sub.title}
                                              </Text>

                                              {sub.status && (
                                                  <Text className="text-[11px] ml-2 text-[#64748B]">
                                                      {sub.status ===
                                                      'IN_PROGRESS'
                                                          ? 'IN PROGRESS'
                                                          : 'QUEUED'}
                                                  </Text>
                                              )}
                                          </View>
                                      </View>
                                  ))}
                        </View>
                    </View>
                ))}
            </View>
        </View>
    )
}
