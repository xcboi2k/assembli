import * as SQLite from 'expo-sqlite'

export const db = SQLite.openDatabaseSync('app.db')

export const initDB = async () => {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            created_at TEXT
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
            status TEXT
        );

        CREATE TABLE IF NOT EXISTS subtasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id INTEGER,
            name TEXT,
            status TEXT
        );

        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            description TEXT,
            created_at TEXT,
            is_seeded INTEGER NOT NULL DEFAULT 0
        );
    `)

    try {
        await db.execAsync(
            `ALTER TABLE categories ADD COLUMN is_seeded INTEGER NOT NULL DEFAULT 0`
        )
    } catch {
        /* column already exists */
    }

    const seededCategoryNames = [
        'Model Kits',
        'Building Blocks',
        'Miniatures',
        'Diecast Models',
        'RC & Robotics',
        'Tools',
        'Paints',
        'Accessories',
    ]

    for (const name of seededCategoryNames) {
        await db.runAsync(
            `UPDATE categories SET is_seeded = 1 WHERE name = ?`,
            [name]
        )
    }

    try {
        await db.execAsync(
            `ALTER TABLE collections ADD COLUMN category_id INTEGER`
        )
    } catch {
        /* column already exists */
    }

    await db.runAsync(
        `UPDATE collections SET category_id = (
            SELECT c.id FROM categories c WHERE c.name = collections.category
        ) WHERE category_id IS NULL AND category IS NOT NULL`
    )
}

export const seedCategories = async () => {
    const existing = await db.getFirstAsync(
        `SELECT COUNT(*) as count FROM categories`
    )

    if (existing?.count > 0) return

    const now = new Date().toISOString()

    const categories = [
        [
            'Model Kits',
            'Snap-fit or glue assembly scale models (Gunpla, Tamiya, etc.)',
        ],
        ['Building Blocks', 'Modular construction toys like LEGO systems'],
        ['Miniatures', 'Figures, dioramas, tabletop models'],
        ['Diecast Models', 'Pre-assembled metal scale models'],
        ['RC & Robotics', 'Remote control and robotic kits'],
        ['Tools', 'Hobby tools for assembly and detailing'],
        ['Paints', 'Model paints, coatings, and finishes'],
        ['Accessories', 'Custom parts, decals, upgrades'],
    ]

    for (const [name, desc] of categories) {
        await db.runAsync(
            `INSERT INTO categories (name, description, created_at, is_seeded)
             VALUES (?, ?, ?, 1)`,
            [name, desc, now]
        )
    }
}
