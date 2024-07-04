import { count, eq } from "drizzle-orm"
import { votingData } from "../db/schema"
import jose from 'jose'

export default defineEventHandler(async event => {
    const db = event.context.drizzle
    const [tab, space] = await Promise.all([
        db.select({
            tab: count()
        })
            .from(votingData)
            .where(eq(votingData.voteType, 0)),
        db.select({
            space: count()
        })
            .from(votingData)
            .where(eq(votingData.voteType, 1)),
    ])
    return {
        tab: tab[0].tab,
        space: space[0].space,
    }
})