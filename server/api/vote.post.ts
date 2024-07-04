import { LibsqlError } from "@libsql/client"
import { votingData } from "../db/schema"
import * as jose from 'jose'

export default defineEventHandler(async event => {
    const { APP_PROTECTION_KEY } = useRuntimeConfig(event)
    const secret = jose.base64url.decode(APP_PROTECTION_KEY)

    const xidEncrypted = getCookie(event, 'xid')
    var xid = ''
    if (!xidEncrypted) {
        xid = generateId()
        const jwt = await new jose.EncryptJWT({
            'xid': xid,
        })
            .setProtectedHeader({
                alg: 'dir',
                enc: 'A128CBC-HS256',
            })
            .setIssuedAt()
            .encrypt(secret)
        setCookie(event, 'xid', jwt, {
            sameSite: 'lax',
            secure: true,
            httpOnly: true,
        })
    } else {
        try {
            const { payload } = await jose.jwtDecrypt(xidEncrypted, secret)
            xid = payload.xid as string
        } catch (e) {
            deleteCookie(event, 'xid')
            throw createError({
                message: 'Try again please',
                statusCode: 400,
            })
        }
    }

    const { vote } = getQuery(event)
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
    const db = event.context.drizzle
    try {
        await db.insert(votingData).values({
            id: xid,
            voteType: voteType,
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