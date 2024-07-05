import * as jose from 'jose'

export const validateXid = async (xidEncrypted: string | undefined, protectionKey: string) => {
    if (!import.meta.server || !xidEncrypted) {
        return undefined
    }

    try {
        const secret = jose.base64url.decode(protectionKey)
        const { payload } = await jose.jwtDecrypt(xidEncrypted, secret)
        return (payload?.xid ?? '') as string
    } catch (e) {
        console.error('validateXid', { e })
        return undefined
    }
}