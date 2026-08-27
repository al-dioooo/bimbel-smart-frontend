import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const AUTH_COOKIE = "bimbel_smart_auth_token"

/**
 * Token gate for the whole app.
 *
 * The previous version also guarded `/admin/*` prefixes that do not exist,
 * redirected to a `/forbidden` route that was never built, and read
 * `NEXT_PUBLIC_API_URL`, which is not defined anywhere (the app uses API_URL).
 * Role-based access is not modelled in the UI yet, so this stays a token check.
 */
export function middleware(req: NextRequest) {
    const token = req.cookies.get(AUTH_COOKIE)?.value ?? null
    const isLoginRoute = req.nextUrl.pathname === "/login"

    if (isLoginRoute) {
        return token ? NextResponse.redirect(new URL("/", req.url)) : NextResponse.next()
    }

    if (!token) {
        const loginUrl = new URL("/login", req.url)
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

// Protect everything except Next.js assets.
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)).*)',
    ],
}
