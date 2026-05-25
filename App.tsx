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
import * as Sentry from '@sentry/react-native'
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin'
import * as SQLite from 'expo-sqlite'

import { RootNavigator } from '@/navigation'
import { ToastProvider } from './providers/ToastProvider'
import { db, initDB } from './backend/db'
import {
    Entypo,
    Feather,
    FontAwesome,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
} from '@expo/vector-icons'

Sentry.init({
    dsn: 'https://1973f8127c62cdd92a976f6ec20f9d91@o4511221589475328.ingest.us.sentry.io/4511374275051520',
    // Adds more context data to events (IP address, cookies, user, etc.)
    // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
    sendDefaultPii: true,
})

SplashScreen.preventAutoHideAsync()

export default Sentry.wrap(function App() {
    useDrizzleStudio(db)
    const [loaded, error] = useFonts({
        SpaceGrotesk_400Regular,
        SpaceGrotesk_600SemiBold,
        SpaceGrotesk_700Bold,
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        ...Ionicons.font,
        ...MaterialIcons.font,
        ...Feather.font,
        ...Entypo.font,
        ...FontAwesome.font,
        ...MaterialCommunityIcons.font,
    })

    useEffect(() => {
        const prepare = async () => {
            try {
                await initDB()

                // const tasks = await db.getAllAsync('SELECT * FROM tasks')

                // console.log('TABLES:', tasks)
            } catch (e) {
                console.log('DB ERROR:', e)
            }
        }

        prepare()
    }, [])

    useEffect(() => {
        async function hideSplash() {
            if (loaded || error) {
                await SplashScreen.hideAsync()
            }
        }

        hideSplash()
    }, [loaded, error])

    if (!loaded && !error) {
        return null
    }

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <StatusBar style="light" />
                <ToastProvider>
                    <RootNavigator />
                </ToastProvider>
            </NavigationContainer>
        </SafeAreaProvider>
    )
})
