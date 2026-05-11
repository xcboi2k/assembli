import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { useFonts } from 'expo-font'
import {
    SpaceGrotesk_400Regular,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk'

import {
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
} from '@expo-google-fonts/inter'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { RootNavigator } from '@/navigation'

SplashScreen.preventAutoHideAsync()

export default function App() {
    const [loaded] = useFonts({
        SpaceGrotesk_400Regular,
        SpaceGrotesk_600SemiBold,
        SpaceGrotesk_700Bold,
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
    })

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync()
        }
    }, [loaded])

    if (!loaded) return null
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <StatusBar style="light" />
                <RootNavigator />
            </NavigationContainer>
        </SafeAreaProvider>
    )
}
