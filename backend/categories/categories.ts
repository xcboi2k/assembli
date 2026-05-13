import { db } from '../db'
import { AppResponse, DeleteScopeBreakdown } from '../error-system'

export const getCategories = async () => {
    try {
        const result = await db.getAllAsync(
            `SELECT * FROM categories ORDER BY id ASC`
        )

        return {
            success: true,
            message: 'Categories fetched',
            data: result,
        }
    } catch (error) {
        console.log(error)

        return {
            success: false,
            message: 'Failed to fetch categories',
            data: [],
        }
    }
}

export const createCategory = async (name: string, description?: string) => {
    try {
        if (!name.trim()) {
            return {
                success: false,
                message: 'Category name is required',
            }
        }

        await db.runAsync(
            `INSERT INTO categories (name, description, created_at, is_seeded)
             VALUES (?, ?, ?, 0)`,
            [name, description || '', new Date().toISOString()]
        )

        return {
            success: true,
            message: 'Category created',
        }
    } catch (error) {
        console.log(error)

        return {
            success: false,
            message: 'Category already exists or failed',
        }
    }
}

export const updateCategory = async (data: {
    id: number
    name: string
    description?: string
}) => {
    try {
        if (!data.name?.trim()) {
            return {
                success: false,
                message: 'Category name is required',
            }
        }

        const existing = await db.getFirstAsync(
            `SELECT * FROM categories WHERE id = ?`,
            [data.id]
        )

        if (!existing) {
            return {
                success: false,
                message: 'Category not found',
            }
        }

        if (Number((existing as { is_seeded?: number }).is_seeded) === 1) {
            return {
                success: false,
                message: 'Built-in categories cannot be edited',
            }
        }

        const result = await db.runAsync(
            `UPDATE categories SET name = ?, description = ? WHERE id = ?`,
            [data.name.trim(), data.description ?? '', data.id]
        )

        if (result.changes === 0) {
            return {
                success: false,
                message: 'Category not found',
            }
        }

        return {
            success: true,
            message: 'Category updated',
        }
    } catch (error) {
        console.log(error)

        return {
            success: false,
            message: 'Category update failed or name already exists',
        }
    }
}

export const deleteCategory = async (
    id: number
): Promise<AppResponse<DeleteScopeBreakdown>> => {
    try {
        const category = await db.getFirstAsync(
            `SELECT * FROM categories WHERE id = ?`,
            [id]
        )

        if (!category) {
            return {
                success: false,
                message: 'Category not found',
            }
        }

        if (Number((category as { is_seeded?: number }).is_seeded) === 1) {
            return {
                success: false,
                message: 'Built-in categories cannot be deleted',
            }
        }

        const categoryName = String((category as { name: string }).name)

        const refRow = await db.getFirstAsync<{ n: number }>(
            `SELECT COUNT(*) as n FROM collections
             WHERE category_id = ? OR (category IS NOT NULL AND category = ?)`,
            [id, categoryName]
        )
        const refCount = Number(refRow?.n ?? 0)

        if (refCount > 0) {
            const breakdown: DeleteScopeBreakdown = {
                removed: {
                    collections: 0,
                    tasks: 0,
                    subtasks: 0,
                    categories: 0,
                },
                blocking: {
                    collectionsReferencingCategory: refCount,
                    detail: 'No rows were deleted. Reassign or delete those collections first (deleting a collection removes its tasks/subtasks but never removes category catalog rows).',
                },
            }

            return {
                success: false,
                message: `Cannot delete this category while ${refCount} collection(s) still reference it.`,
                data: breakdown,
            }
        }

        await db.runAsync(`DELETE FROM categories WHERE id = ?`, [id])

        const breakdown: DeleteScopeBreakdown = {
            removed: {
                collections: 0,
                tasks: 0,
                subtasks: 0,
                categories: 1,
            },
        }

        return {
            success: true,
            message: 'Category deleted',
            data: breakdown,
        }
    } catch (error) {
        console.log(error)

        return {
            success: false,
            message: 'Failed to delete category',
        }
    }
}
