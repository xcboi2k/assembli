import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'

import AuthNavigator from './AuthNavigator'
import MainTabNavigator from './MainTabNavigator'

import type { RootStackParamList } from './types'
import UserStore from '@/stores/UserStore'

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function RootNavigator() {
    const isLoggedIn = UserStore((state) => state.isLoggedIn)
    return (
        <Stack.Navigator
            initialRouteName="Auth"
            screenOptions={{ headerShown: false }}
        >
            {isLoggedIn === true ? (
                <>
                    <Stack.Screen name="Main" component={MainTabNavigator} />
                </>
            ) : (
                <Stack.Screen name="Auth" component={AuthNavigator} />
            )}
        </Stack.Navigator>
    )
}
