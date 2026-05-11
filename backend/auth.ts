import * as SecureStore from 'expo-secure-store'
import bcrypt from 'react-native-bcrypt'
import { db } from './db'

// Optional but recommended
bcrypt.setRandomFallback((len) => {
    const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    let result = ''

    for (let i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return result
})

export const register = async (username: string, password: string) => {
    // Hash password
    const hashedPassword = await bcrypt.hashSync(password, 10)

    await db.runAsync(
        `INSERT INTO users (username, password)
         VALUES (?, ?)`,
        [username, hashedPassword]
    )
}

export const login = async (username: string, password: string) => {
    // Find user by username only
    const user: any = await db.getFirstAsync(
        `SELECT * FROM users
         WHERE username = ?`,
        [username]
    )

    if (!user) {
        throw new Error('Invalid credentials')
    }

    // Compare entered password
    const isValid = await bcrypt.compareSync(password, user.password)

    if (!isValid) {
        throw new Error('Invalid credentials')
    }

    // Remove password before storing session
    const safeUser = {
        id: user.id,
        username: user.username,
    }

    await SecureStore.setItemAsync('user', JSON.stringify(safeUser))

    return safeUser
}

export const logout = async () => {
    await SecureStore.deleteItemAsync('user')
}

export const getCurrentUser = async () => {
    const user = await SecureStore.getItemAsync('user')

    return user ? JSON.parse(user) : null
}
