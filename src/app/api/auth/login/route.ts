import { NextResponse, type NextRequest } from 'next/server'

import { apiUrl, isCrossOriginWrite, setToken } from '@/lib/server/session'

/**
 * Logs in against the API and keeps the token in the HttpOnly cookie. The
 * browser gets the user, never the token.
 */
export async function POST(req: NextRequest) {
    if (isCrossOriginWrite(req)) {
        return NextResponse.json({ message: 'Permintaan ditolak.' }, { status: 403 })
    }

    const upstream = await fetch(apiUrl('/login'), {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: await req.text(),
        cache: 'no-store',
    })
    const body = await upstream.json().catch(() => ({ message: 'Terjadi kesalahan. Silakan coba lagi.' }))

    if (!upstream.ok || !body?.data?.token) {
        return NextResponse.json(body, { status: upstream.ok ? 502 : upstream.status })
    }

    const res = NextResponse.json({ message: body.message, data: { user: body.data.user } })
    setToken(req, res, body.data.token)
    return res
}
