import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'

import CollectionAddScreen from '@/components/screens/main/CollectionAddScreen'
import CollectionDetailsScreen from '@/components/screens/main/CollectionDetailsScreen'
import CollectionScreen from '@/components/screens/main/CollectionScreen'
import type { CollectionsStackParamList } from './types'
import TaskAddScreen from '@/components/screens/main/TaskAddScreen'
import CollectionEditScreen from '@/components/screens/main/CollectionEditScreen'

const Stack = createNativeStackNavigator<CollectionsStackParamList>()

export default function CollectionsStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="CollectionHome" component={CollectionScreen} />
            <Stack.Screen
                name="CollectionDetails"
                component={CollectionDetailsScreen}
            />
            <Stack.Screen
                name="CollectionEdit"
                component={CollectionEditScreen}
            />
            <Stack.Screen name="CollectionTaskAdd" component={TaskAddScreen} />
        </Stack.Navigator>
    )
}
