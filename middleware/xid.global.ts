import * as jose from 'jose'
import { uuidv7 } from 'uuidv7'

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (!import.meta.server) {
        return
    }

    const xidCookie = useCookie('xid', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    })
    const xidEncrypted = xidCookie.value
    var xid = ''
    if (!xidEncrypted) {
        const { APP_PROTECTION_KEY } = useRuntimeConfig()
        const secret = jose.base64url.decode(APP_PROTECTION_KEY)
        xid = uuidv7()
        const jwt = await new jose.EncryptJWT({
            'xid': xid,
        })
            .setProtectedHeader({
                alg: 'dir',
                enc: 'A128CBC-HS256',
            })
            .setIssuedAt()
            .encrypt(secret)
        xidCookie.value = jwt
    } else {
        const { APP_PROTECTION_KEY } = useRuntimeConfig()
        if (!(await validateXid(xidEncrypted, APP_PROTECTION_KEY))) {
            xidCookie.value = undefined
            await navigateTo('/')
        }
    }
})
