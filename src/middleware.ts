import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const ADMIN_ONLY_PREFIXES = [
    "/admin/users",
    "/admin/settings",
    "/admin/mentors"
]

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("bimbel_smart_auth_token")?.value ?? null
    const path = req.nextUrl.pathname

    const isLoginRoute = path === "/login"

    if (isLoginRoute) {
        if (token) {
            return NextResponse.redirect(new URL("/", req.url)) // or "/dashboard"
        }
        return NextResponse.next()
    }

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    const isAdminOnly = ADMIN_ONLY_PREFIXES.some((prefix) =>
        path.startsWith(prefix)
    )

    if (!isAdminOnly) {
        return NextResponse.next()
    }

    let role: string | null = null

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/me`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                cache: "no-store",
            }
        )

        if (res.ok) {
            const data = await res.json()
            role = data.role ?? data.user?.role ?? null
        }
    } catch (err) {
        console.error("Error checking user role in middleware:", err)
    }

    if (role !== "admin") {
        // Not admin → block access
        return NextResponse.redirect(new URL("/forbidden", req.url))
    }

    return NextResponse.next()
}

// Protect basically everything except Next.js assets
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)).*)',
    ],
}