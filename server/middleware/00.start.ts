import * as schema from '~/server/db/schema';
import db from '../db/db';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';

declare module 'h3' {
    interface H3EventContext {
        drizzle: LibSQLDatabase<typeof schema>,
    }
}

export default defineEventHandler(async (event) => {
    const env = {
        ...event.context.cloudflare?.env,
        ...process.env,
    }
    const config = useRuntimeConfig(event)
    event.context.drizzle = db({
        ...env,
        enableLogging: config.app.enableDrizzleLogging,
    }).drizzleClient
})
