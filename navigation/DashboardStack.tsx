import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'

import DashboardScreen from '@/components/screens/main/DashboardScreen'

import type { DashboardStackParamList } from './types'

const Stack = createNativeStackNavigator<DashboardStackParamList>()

export default function DashboardStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="DashboardHome" component={DashboardScreen} />
        </Stack.Navigator>
    )
}
