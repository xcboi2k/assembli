import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'

import LoginScreen from '@/components/screens/auth/LoginScreen'
import SignUpScreen from '@/components/screens/auth/SignUpScreen'

import type { AuthStackParamList } from './types'

const Stack = createNativeStackNavigator<AuthStackParamList>()

export default function AuthNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
    )
}
