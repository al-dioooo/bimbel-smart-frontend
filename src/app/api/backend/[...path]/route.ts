import { NextResponse, type NextRequest } from 'next/server'

import { apiUrl, clearToken, clientIpHeaders, isCrossOriginWrite, readToken } from '@/lib/server/session'

/**
 * Response headers worth passing back to the browser (files, throttling).
 * Not content-length or content-encoding: fetch() has already decompressed
 * the body, so the upstream length would truncate it.
 */
const PASS_HEADERS = ['content-type', 'content-disposition', 'cache-control', 'retry-after']

/**
 * Paths the proxy never forwards: dot segments (no reliance on URL
 * normalisation), and login, which returns the raw token; logging in goes
 * through /api/auth/login, which keeps the token in the HttpOnly cookie.
 */
function refused(path: string[]): boolean {
    return path.length === 0
        || path.some((segment) => segment === '' || segment === '.' || segment === '..')
        || path[0].toLowerCase() === 'login'
}

/**
 * Same-origin proxy to the API: `/api/backend/<path>` → `${API_URL}/<path>`
 * with the Bearer token from the HttpOnly cookie. Bodies and files (PDF,
 * Excel) stream through untouched. A 401 from the API also drops the cookie,
 * so the page gate sends the user to the login page.
 */
async function forward(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    if (isCrossOriginWrite(req)) {
        return NextResponse.json({ message: 'Permintaan ditolak.' }, { status: 403 })
    }

    const { path } = await params
    if (refused(path)) {
        return NextResponse.json({ message: 'Alamat tidak ditemukan.' }, { status: 404 })
    }
    const target = apiUrl(path.map(encodeURIComponent).join('/')) + req.nextUrl.search

    const headers = new Headers({ Accept: req.headers.get('accept') ?? 'application/json', ...clientIpHeaders(req) })
    const contentType = req.headers.get('content-type')
    if (contentType) headers.set('Content-Type', contentType)
    const token = readToken(req)
    if (token) headers.set('Authorization', `Bearer ${token}`)

    const hasBody = !['GET', 'HEAD'].includes(req.method)
    const upstream = await fetch(target, {
        method: req.method,
        headers,
        body: hasBody ? await req.arrayBuffer() : undefined,
        cache: 'no-store',
        redirect: 'manual',
    }).catch(() => null)

    if (!upstream) {
        return NextResponse.json({ message: 'Server tidak dapat dihubungi. Silakan coba lagi.' }, { status: 502 })
    }

    const resHeaders = new Headers()
    for (const name of PASS_HEADERS) {
        const value = upstream.headers.get(name)
        if (value) resHeaders.set(name, value)
    }

    const res = new NextResponse(upstream.body, { status: upstream.status, headers: resHeaders })
    if (upstream.status === 401) clearToken(res)
    return res
}

export { forward as GET, forward as POST, forward as PUT, forward as PATCH, forward as DELETE }
