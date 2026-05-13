export type AppResponse<T = null> = {
    success: boolean
    message: string
    data?: T
}

/** Returned in `data` for delete collection / delete category so the UI can explain scope. */
export type DeleteScopeBreakdown = {
    removed: {
        collections: number
        tasks: number
        subtasks: number
        categories: number
    }
    /** Present on successful collection delete — categories table is never modified here. */
    skipped?: {
        categoryCatalogNote?: string
    }
    /** Present when category delete is refused because collections still reference it. */
    blocking?: {
        collectionsReferencingCategory: number
        detail?: string
    }
}

export const handleDBError = (error: any, context: string): AppResponse<any> => {
    console.log(`[${context}]`, error)

    return {
        success: false,
        message: `${context} failed. Please try again.`,
    }
}
