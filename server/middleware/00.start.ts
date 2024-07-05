import * as schema from '~/server/db/schema';
import db from '../db/db';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as jose from 'jose'
import { validateXid } from '~/utils/tokens';

declare module 'h3' {
    interface H3EventContext {
        drizzle: LibSQLDatabase<typeof schema>,
        xid: string,
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

    const { APP_PROTECTION_KEY } = useRuntimeConfig(event)
    const xidEncrypted = getCookie(event, 'xid')
    const xid = await validateXid(xidEncrypted, APP_PROTECTION_KEY)
    if (xid) {
        event.context.xid = xid
    }
})
