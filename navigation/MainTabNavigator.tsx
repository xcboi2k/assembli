import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'

import CategoriesStack from './CategoriesStack'
import CollectionsStack from './CollectionsStack'
import DashboardStack from './DashboardStack'
import MainTabBar from './MainTabBar'

import type { MainTabParamList } from './types'

const Tab = createBottomTabNavigator<MainTabParamList>()

export default function MainTabNavigator() {
    return (
        <Tab.Navigator
            tabBar={(props) => <MainTabBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardStack}
                options={{ tabBarLabel: 'DASHBOARD' }}
            />
            <Tab.Screen
                name="Collections"
                component={CollectionsStack}
                options={{ tabBarLabel: 'COLLECTIONS' }}
            />
            <Tab.Screen
                name="Categories"
                component={CategoriesStack}
                options={{ tabBarLabel: 'CATEGORIES' }}
            />
        </Tab.Navigator>
    )
}
