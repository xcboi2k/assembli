import * as SecureStore from 'expo-secure-store'
import bcrypt from 'react-native-bcrypt'
import { db } from './db'

bcrypt.setRandomFallback((len) => {
    const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    let result = ''

    for (let i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return result
})

type AuthResponse = {
    success: boolean
    message: string
    user?: {
        id: number
        username: string
        created_at?: string
    } | null
}

export const register = async (
    username: string,
    password: string
): Promise<AuthResponse> => {
    try {
        // Validation
        if (!username.trim()) {
            return {
                success: false,
                message: 'Username is required',
            }
        }

        if (!password.trim()) {
            return {
                success: false,
                message: 'Password is required',
            }
        }

        if (password.length < 6) {
            return {
                success: false,
                message: 'Password must be at least 6 characters',
            }
        }

        // Check existing user
        const existingUser: any = await db.getFirstAsync(
            `SELECT * FROM users
                 WHERE username = ?`,
            [username]
        )

        if (existingUser) {
            return {
                success: false,
                message: 'Username already exists',
            }
        }

        // Hash password
        const hashedPassword = bcrypt.hashSync(password, 10)

        // Join date
        const createdAt = new Date().toISOString()

        await db.runAsync(
            `INSERT INTO users (
                username,
                password,
                created_at
            )
            VALUES (?, ?, ?)`,
            [username, hashedPassword, createdAt]
        )

        return {
            success: true,
            message: 'Account created successfully',
        }
    } catch (error) {
        console.log(error)

        return {
            success: false,
            message: 'Something went wrong',
        }
    }
}

export const login = async (
    username: string,
    password: string
): Promise<AuthResponse> => {
    try {
        if (!username.trim()) {
            return {
                success: false,
                message: 'Username is required',
                user: null,
            }
        }

        if (!password.trim()) {
            return {
                success: false,
                message: 'Password is required',
                user: null,
            }
        }

        const user: any = await db.getFirstAsync(
            `SELECT * FROM users
             WHERE username = ?`,
            [username]
        )

        if (!user) {
            return {
                success: false,
                message: 'User not found',
                user: null,
            }
        }

        const isValid = bcrypt.compareSync(password, user.password)

        if (!isValid) {
            return {
                success: false,
                message: 'Invalid password',
                user: null,
            }
        }

        const safeUser = {
            id: user.id,
            username: user.username,
            created_at: user.created_at,
        }

        await SecureStore.setItemAsync('user', JSON.stringify(safeUser))

        return {
            success: true,
            message: 'Login successful',
            user: safeUser,
        }
    } catch (error) {
        console.log(error)

        return {
            success: false,
            message: 'Something went wrong',
            user: null,
        }
    }
}

export const logout = async () => {
    try {
        await SecureStore.deleteItemAsync('user')

        return {
            success: true,
            message: 'Logged out successfully',
        }
    } catch (error) {
        return {
            success: false,
            message: 'Failed to logout',
        }
    }
}

export const getCurrentUser = async () => {
    try {
        const user = await SecureStore.getItemAsync('user')

        return user ? JSON.parse(user) : null
    } catch (error) {
        return null
    }
}
