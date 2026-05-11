import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'

import AuthNavigator from './AuthNavigator'
import MainTabNavigator from './MainTabNavigator'

import type { RootStackParamList } from './types'

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function RootNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="Auth"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Auth" component={AuthNavigator} />
            <Stack.Screen name="Main" component={MainTabNavigator} />
        </Stack.Navigator>
    )
}
