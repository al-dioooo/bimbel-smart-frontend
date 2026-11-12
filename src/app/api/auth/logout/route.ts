import { NextResponse, type NextRequest } from 'next/server'

import { apiUrl, clearToken, isCrossOriginWrite, readToken } from '@/lib/server/session'

/** REQ-010: revokes the token on the API, then drops the cookie whatever the API says. */
export async function POST(req: NextRequest) {
    if (isCrossOriginWrite(req)) {
        return NextResponse.json({ message: 'Permintaan ditolak.' }, { status: 403 })
    }

    const token = readToken(req)
    let message = 'Anda telah berhasil logout.'

    if (token) {
        const upstream = await fetch(apiUrl('/logout'), {
            method: 'POST',
            headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
            cache: 'no-store',
        }).catch(() => null)
        const body = await upstream?.json().catch(() => null)
        if (body?.message) message = body.message
    }

    const res = NextResponse.json({ message })
    clearToken(res)
    return res
}
