import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'

import DashboardScreen from '@/components/screens/main/DashboardScreen'

import type { DashboardStackParamList } from './types'
import CollectionAddScreen from '@/components/screens/main/CollectionAddScreen'
import TaskAddScreen from '@/components/screens/main/TaskAddScreen'

const Stack = createNativeStackNavigator<DashboardStackParamList>()

export default function DashboardStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="DashboardHome" component={DashboardScreen} />
            <Stack.Screen
                name="DashboardCollectionAdd"
                component={CollectionAddScreen}
            />
            <Stack.Screen name="DashboardTaskAdd" component={TaskAddScreen} />
        </Stack.Navigator>
    )
}
