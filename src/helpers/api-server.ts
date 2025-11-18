// lib/api-server.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

const DEFAULT_SERVER_HEADERS = {
    Accept: "application/json",
    "Content-Type": "application/json",
};

/**
 * 100% Server-Safe global fetcher
 */
export async function apiServerFetch(
    url: string,
    options: RequestInit = {}
) {
    const fullUrl = url.startsWith("http") ? url : `${API_BASE}${url}`;

    const headers = {
        ...DEFAULT_SERVER_HEADERS,
        ...(options.headers || {}),
    };

    // 🔥 Server-side token support (cookies, headers)
    // This is allowed in RSC
    if (options?.credentials === "include") {
        // Example only — can extract cookies using Next.js server APIs
        const cookieStore = await import("next/headers").then((m) =>
            m.cookies()
        );
        const token = cookieStore.get("token")?.value;
        if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(fullUrl, {
        ...options,
        headers,
        cache: "no-store",
    });

    if (!res.ok) {
        let msg = res.statusText;
        try {
            const json = await res.json();
            msg = json?.message || res.statusText;
        } catch { }

        throw new Error(`API Error ${res.status}: ${msg}`);
    }

    return res.json();
}