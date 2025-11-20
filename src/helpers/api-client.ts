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
export async function apiFetch(url: string, options: RequestInit = {}, onProgress?: (progress: number) => void) {
    // Resolve full URL
    const fullUrl = url.startsWith("http") ? url : `${API_BASE}${url}`

    // Merge headers
    const headers: HeadersInit = {
        ...DEFAULT_CLIENT_HEADERS,
        ...(options.headers || {}),
    }

    // Attach auth token (client-side only)
    const token = typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null

    if (token) {
        headers["Authorization"] = `Bearer ${token}`
    }

    // Start progress tracking
    if (onProgress) onProgress(0); // Set initial progress to 0 when the request starts

    // If we want to handle upload progress (for POST/PUT requests with body)
    if (options.method === 'POST' || options.method === 'PUT') {
        if (options.body && options.body instanceof FormData) {
            const formData = options.body;
            const newBody = new FormData();

            formData.forEach((value, key) => {
                newBody.append(key, value);
            });

            // Attach a custom listener for progress tracking
            const progress = 0;  // Initialize progress tracking state
            const totalSize = formData.get('file')?.size || 0;  // Assuming a file upload

            // Monitor the progress of the file upload
            formData.append('onprogress', (e: ProgressEvent) => {
                if (e.lengthComputable) {
                    const progressPercent = (e.loaded / e.total) * 100;
                    if (onProgress) {
                        onProgress(progressPercent);  // Notify the progress callback
                    }
                }
            });

            options.body = newBody;
        }
    }

    // Execute fetch
    const res = await fetch(fullUrl, {
        ...options,
        headers,
        cache: "no-store", // Disable caching so SWR handles it
    })

    // Handle response (error or successful response)
    if (!res.ok) {
        let msg = res.statusText

        try {
            const json = await res.json()
            msg = json?.message || msg
        } catch { }

        throw new Error(`API Error ${res.status}: ${msg}`)
    }

    // Stop progress bar once response is received
    if (onProgress) onProgress(100);  // Set progress to 100 once the request is completed

    // Auto-parse JSON
    return res.json()
}