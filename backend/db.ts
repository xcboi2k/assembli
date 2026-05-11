import * as SQLite from 'expo-sqlite'

export const db = SQLite.openDatabaseSync('app.db')

export const initDB = async () => {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        );
    `)
}
