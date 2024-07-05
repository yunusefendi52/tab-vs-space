import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const votingData = sqliteTable('votingData', {
    id: text('id').primaryKey().unique(),
    voteType: integer('voteType', {
        mode: 'number',
    }).notNull(),
    createdAt: integer('createdAt', {
        mode: 'timestamp_ms',
    })
})
