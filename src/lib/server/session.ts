import type { NextRequest, NextResponse } from 'next/server'

/**
 * The API token lives only in this HttpOnly cookie (N2, §2.5 2a, §6.6):
 * browser scripts cannot read it, and it is only sent same-site. The
 * Next.js route handlers attach it to API calls as a Bearer token.
 */
export const AUTH_COOKIE = 'bimbel_smart_auth_token'

/** The API base, e.g. https://api.example.com/api — server-side only. */
export function apiUrl(path: string): string {
    const base = (process.env.API_URL ?? '').replace(/\/+$/, '')
    return `${base}/${path.replace(/^\/+/, '')}`
}

export function readToken(req: NextRequest): string | null {
    return req.cookies.get(AUTH_COOKIE)?.value ?? null
}

/** Secure whenever the app is served over HTTPS (Vercel); plain HTTP only works locally. */
export function setToken(req: NextRequest, res: NextResponse, token: string) {
    res.cookies.set(AUTH_COOKIE, token, {
        httpOnly: true,
        secure: req.nextUrl.protocol === 'https:',
        sameSite: 'lax',
        path: '/',
        // The API ends idle sessions after 30 minutes; the cookie just needs
        // to outlive a working day so that the API, not the browser, decides.
        maxAge: 60 * 60 * 12,
    })
}

export function clearToken(res: NextResponse) {
    res.cookies.set(AUTH_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })
}

/** Defence in depth next to SameSite=Lax: refuse cross-origin writes. */
export function isCrossOriginWrite(req: NextRequest): boolean {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return false
    const origin = req.headers.get('origin')
    if (!origin) return false
    try {
        return new URL(origin).host !== req.headers.get('host')
    } catch {
        return true
    }
}
