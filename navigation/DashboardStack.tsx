import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'

import DashboardScreen from '@/components/screens/main/dashboard/DashboardScreen'

import DashboardCollectionAddScreen from '@/components/screens/main/dashboard/DashboardCollectionAddScreen'
import DashboardTaskAddScreen from '@/components/screens/main/dashboard/DashboardTaskAddScreen'
import type { DashboardStackParamList } from './types'

const Stack = createNativeStackNavigator<DashboardStackParamList>()

export default function DashboardStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="DashboardHome" component={DashboardScreen} />
            <Stack.Screen
                name="DashboardCollectionAdd"
                component={DashboardCollectionAddScreen}
            />
            <Stack.Screen
                name="DashboardTaskAdd"
                component={DashboardTaskAddScreen}
            />
        </Stack.Navigator>
    )
}
