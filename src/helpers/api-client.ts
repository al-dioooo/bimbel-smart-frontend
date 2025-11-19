'use client'

const API_BASE = process.env.API_URL!

const DEFAULT_CLIENT_HEADERS = {
    Accept: "application/json",
    "Content-Type": "application/json",
}

/**
 * Client-side fetch wrapper with global API configuration
 * Safe for:
 * - SWR
 * - Client Components
 * - Auth via localStorage
 */
export async function apiFetch(url: string, options: RequestInit = {}) {
    // Resolve full URL
    const fullUrl = url.startsWith("http") ? url : `${API_BASE}${url}`

    // Merge headers
    const headers: HeadersInit = {
        ...DEFAULT_CLIENT_HEADERS,
        ...(options.headers || {}),
    }

    // 🔥 Attach auth token (client-side only)
    const token = typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null

    if (token) {
        headers["Authorization"] = `Bearer ${token}`
    }

    // Execute fetch
    const res = await fetch(fullUrl, {
        ...options,
        headers,
        cache: "no-store", // disable caching so SWR handles it
    })

    // Normalize error from Laravel API
    if (!res.ok) {
        let msg = res.statusText

        try {
            const json = await res.json()
            msg = json?.message || msg
        } catch { }

        throw new Error(`API Error ${res.status}: ${msg}`)
    }

    // Auto-parse JSON
    return res.json()
}