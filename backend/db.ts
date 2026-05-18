import * as SQLite from 'expo-sqlite'

export const db = SQLite.openDatabaseSync('app.db')

export const initDB = async () => {
    await db.execAsync(`
        PRAGMA foreign_keys = ON;
        
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            created_at TEXT
        );

        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            description TEXT,
            created_at TEXT,
            is_seeded INTEGER NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS collections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            name TEXT,
            series TEXT,
            category TEXT,
            category_id INTEGER,
            procurement_date TEXT
        );

        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            collection_id INTEGER,
            name TEXT,
            status TEXT,
            FOREIGN KEY (collection_id)
                REFERENCES collections(id)
                ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS subtasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id INTEGER,
            name TEXT,
            status TEXT,
            FOREIGN KEY (task_id)
                REFERENCES tasks(id)
                ON DELETE CASCADE
        );
    `)

    // ensure schema migration (safe, idempotent)
    try {
        await db.execAsync(
            `ALTER TABLE collections ADD COLUMN category_id INTEGER`
        )
    } catch {}

    // auto-seed categories
    await seedCategories()
}

export const seedCategories = async () => {
    // safer check (better than COUNT)
    const existing = await db.getFirstAsync(`SELECT id FROM categories LIMIT 1`)

    if (existing) return

    const now = new Date().toISOString()

    const categories = [
        ['Model Kits', 'Snap-fit or glue models (Gunpla, Tamiya, etc.)'],
        ['Building Blocks', 'LEGO-style construction systems'],
        ['Miniatures', 'Figures, dioramas, tabletop models'],
        ['Diecast Models', 'Pre-assembled metal scale models'],
        ['RC & Robotics', 'Remote control and robotics kits'],
        ['Tools', 'Hobby tools for building & detailing'],
        ['Paints', 'Model paints and finishes'],
        ['Accessories', 'Custom parts, decals, upgrades'],
    ]

    for (const [name, description] of categories) {
        await db.runAsync(
            `INSERT INTO categories (name, description, created_at, is_seeded)
             VALUES (?, ?, ?, 1)`,
            [name, description, now]
        )
    }
}
