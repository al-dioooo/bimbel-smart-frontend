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

/**
 * Secure in every production build, whatever protocol the request reached
 * Next.js with (behind a TLS-terminating proxy it is plain HTTP). Browsers
 * accept Secure cookies on http://localhost, so `next start` still works.
 */
export function setToken(res: NextResponse, token: string) {
    res.cookies.set(AUTH_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        // The API ends idle sessions after 30 minutes; the cookie just needs
        // to outlive a working day so that the API, not the browser, decides.
        maxAge: 60 * 60 * 12,
    })
}

/**
 * The visitor's IP for the API's per-IP rate limits. Every call to the API
 * comes from this server, so without it all visitors share one bucket. The
 * API trusts X-Client-IP only together with the shared secret
 * (API_PROXY_SECRET here, FRONTEND_PROXY_SECRET on the API). On Vercel,
 * x-real-ip / x-forwarded-for are set by the platform, not by the browser.
 */
export function clientIpHeaders(req: NextRequest): Record<string, string> {
    const secret = process.env.API_PROXY_SECRET
    const ip = req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    return secret && ip ? { 'X-Client-IP': ip, 'X-Proxy-Secret': secret } : {}
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
