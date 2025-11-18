/**
 * Global API configuration
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL!
const DEFAULT_HEADERS = {
    "Content-Type": "application/json",
    Accept: "application/json",
}

/**
 * Server-safe fetch wrapper
 * Works in:
 * - Server Components
 * - Client Components
 * - SWR
 * - Server Actions
 */
export async function apiFetch(
    url: string,
    options: RequestInit = {}
) {
    const fullUrl = url.startsWith("http") ? url : `${API_BASE}${url}`

    const headers: HeadersInit = {
        ...DEFAULT_HEADERS,
        ...(options.headers || {}),
    }

    // 🔥 Token-safe: works on both server and client
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token")
        if (token) {
            headers["Authorization"] = `Bearer ${token}`
        }
    }

    const res = await fetch(fullUrl, {
        ...options,
        headers,
        cache: "no-store", // globally disable caching unless overridden
    })

    // Normalize Laravel error response
    if (!res.ok) {
        let errorMessage = "Unknown error"
        try {
            const json = await res.json()
            errorMessage = json.message || JSON.stringify(json)
        } catch { }

        throw {
            status: res.status,
            message: errorMessage,
        }
    }

    // Auto-parse JSON
    return res.json()
}