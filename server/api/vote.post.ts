import { LibsqlError } from "@libsql/client"
import { votingData } from "../db/schema"

export default defineEventHandler(async event => {
    const { vote, token } = getQuery(event)
    if (!token) {
        throw createError({
            message: 'Welll',
            statusCode: 200,
        })
    }

    const { TURNSTILE_SECRET_KEY: turnstileSecretKey } = useRuntimeConfig(event)

    const request = new FormData()
    request.append('secret', turnstileSecretKey)
    request.append('response', token?.toString())
    const verifyResponse = await fetch(`https://challenges.cloudflare.com/turnstile/v0/siteverify`, {
        method: 'post',
        body: request,
    })
    const verifyJson = await verifyResponse.json() as any
    if (!verifyJson?.success) {
        console.error(verifyJson)
        throw createError({
            message: 'Odd request',
            statusCode: 200,
        })
    }

    var voteType = undefined
    if (vote === 'tab') {
        voteType = 0
    } else if (vote === 'space') {
        voteType = 1
    } else {
        throw createError({
            message: 'Your vote counts (as if)',
            statusCode: 400,
        })
    }
    const xid = event.context.xid
    if (!xid) {
        throw createError({
            message: 'Something error, are you good?',
            statusCode: 400,
        })
    }

    const db = event.context.drizzle
    try {
        await db.insert(votingData).values({
            id: xid,
            voteType: voteType,
            createdAt: new Date(),
        })
    } catch (e) {
        if (e instanceof LibsqlError && e.code === 'SQLITE_CONSTRAINT') {
            throw createError({
                message: 'You actually voted',
                statusCode: 400,
            })
        } else {
            throw e
        }
    }
    await sendRedirect(event, '/api/data')
})