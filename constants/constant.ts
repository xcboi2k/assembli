export const SYSTEM_MESSAGES = {
    AUTH: {
        LOGIN: {
            title: 'SYSTEM_LOG_IN',
            subtitle: 'LOGGING IN OPERATOR',
        },

        SIGNUP: {
            title: 'OPERATOR_REGISTRATION',
            subtitle: 'INITIALIZING NEW OPERATOR',
        },

        CHANGE_PASSWORD: {
            title: 'SECURITY_OVERRIDE',
            subtitle: 'UPDATING ACCESS CREDENTIALS',
        },
    },

    COLLECTION: {
        ADD: {
            title: 'COLLECTION_INITIALIZATION',
            subtitle: 'REGISTERING NEW COLLECTION',
        },

        UPDATE: {
            title: 'COLLECTION_RECONFIGURATION',
            subtitle: 'UPDATING COLLECTION DATA',
        },

        DELETE: {
            title: 'COLLECTION_TERMINATION',
            subtitle: 'REMOVING COLLECTION RECORD',
        },
    },

    CATEGORY: {
        ADD: {
            title: 'CATEGORY_DEPLOYMENT',
            subtitle: 'ADDING NEW SYSTEM CATEGORY',
        },

        UPDATE: {
            title: 'CATEGORY_RECALIBRATION',
            subtitle: 'MODIFYING CATEGORY PARAMETERS',
        },

        DELETE: {
            title: 'CATEGORY_PURGE',
            subtitle: 'DELETING CATEGORY FROM SYSTEM',
        },
    },
} as const
