import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'

import CategoriesAddScreen from '@/components/screens/main/CategoriesAddScreen'
import CategoriesScreen from '@/components/screens/main/CategoriesScreen'

import type { CategoriesStackParamList } from './types'
import CategoriesEditScreen from '@/components/screens/main/CategoriesEditScreen'

const Stack = createNativeStackNavigator<CategoriesStackParamList>()

export default function CategoriesStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="CategoriesHome" component={CategoriesScreen} />
            <Stack.Screen
                name="CategoriesAdd"
                component={CategoriesAddScreen}
            />
            <Stack.Screen
                name="CategoriesEdit"
                component={CategoriesEditScreen}
            />
        </Stack.Navigator>
    )
}
