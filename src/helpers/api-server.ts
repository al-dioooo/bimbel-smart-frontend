import "@/helpers/unsafe-fetch"
import { RequestInit } from "undici"

const API_BASE = process.env.API_URL

const DEFAULT_SERVER_HEADERS = {
    Accept: "application/json",
    "Content-Type": "application/json",
}

export async function apiServerFetch(
    url: string,
    options: RequestInit = {}
) {
    const fullUrl = url.startsWith("http") ? url : `${API_BASE}${url}`

    const headers = {
        ...DEFAULT_SERVER_HEADERS,
        ...(options.headers || {}),
    }

    const res = await fetch(fullUrl, {
        ...options,
        headers,
        cache: "no-store"
    })

    if (!res.ok) {
        let msg = res.statusText
        try {
            const json = await res.json()
            msg = json?.message || msg
        } catch { }
        throw new Error(`API error ${res.status}: ${msg}`)
    }

    return res.json()
}

export const apiServerGet = (url: string, params?: Record<string, any>) => {
    // Remove any Symbols from params (or other non-serializable values)
    const sanitizedParams = Object.fromEntries(
        Object.entries(params || {}).filter(([key, value]) => typeof value !== 'symbol')
    );

    const query = sanitizedParams
        ? `?${new URLSearchParams(sanitizedParams)}`
        : "";

    return apiServerFetch(`${url}${query}`);
}