import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql/driver";
import * as schema from '~/server/db/schema';

const db = (env: any, migrationMode: boolean = false) => {
    const dbClient = createClient({
        url: env.DB_URL ?? env.NUXT_DB_URL,
        authToken: env.DB_AUTH_TOKEN ?? env.NUXT_DB_AUTH_TOKEN,
    })
    const drizzleClient = drizzle(dbClient, { schema, logger: migrationMode ? false : env?.enableLogging ?? env?.NUXT_APP_ENABLE_DRIZZLE_LOGGING ?? true })
    return {
        drizzleClient,
        dbClient,
    }
}
export default db
