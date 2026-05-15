import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'

import CollectionAddScreen from '@/components/screens/main/collections/CollectionAddScreen'
import CollectionDetailsScreen from '@/components/screens/main/collections/CollectionDetailsScreen'
import CollectionEditScreen from '@/components/screens/main/collections/CollectionEditScreen'
import CollectionScreen from '@/components/screens/main/collections/CollectionScreen'
import TaskAddScreen from '@/components/screens/main/collections/TaskAddScreen'
import type { CollectionsStackParamList } from './types'

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
                name="CollectionAdd"
                component={CollectionAddScreen}
            />
            <Stack.Screen
                name="CollectionEdit"
                component={CollectionEditScreen}
            />
            <Stack.Screen name="CollectionTaskAdd" component={TaskAddScreen} />
        </Stack.Navigator>
    )
}
