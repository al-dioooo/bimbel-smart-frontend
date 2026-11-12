import api from '@/lib/axios'

/** `attachment; filename=slip.pdf` or `filename*=UTF-8''slip.pdf`. */
function filenameFrom(disposition?: string): string | null {
    if (!disposition) return null
    const encoded = disposition.match(/filename\*=UTF-8''([^;]+)/i)
    if (encoded) return decodeURIComponent(encoded[1])
    const plain = disposition.match(/filename="?([^";]+)"?/i)
    return plain ? plain[1] : null
}

/** A failed download comes back as a Blob too; read the API's JSON message out of it. */
export async function downloadErrorMessage(error: unknown, fallback = 'Gagal mengunduh berkas'): Promise<string> {
    const data = (error as { response?: { data?: unknown } }).response?.data
    if (data instanceof Blob) {
        try {
            const body = JSON.parse(await data.text()) as { message?: string }
            return body.message ?? fallback
        } catch {
            return fallback
        }
    }
    return fallback
}

/**
 * Downloads a file from the API (PDF slip, report export) and saves it under
 * the server's file name, or `fallbackName` when the header is not readable.
 */
export async function downloadFile(url: string, params: Record<string, unknown>, fallbackName: string) {
    const response = await api.get<Blob>(url, { params, responseType: 'blob' })
    const name = filenameFrom(response.headers['content-disposition'] as string | undefined) ?? fallbackName

    const href = URL.createObjectURL(response.data)
    const link = document.createElement('a')
    link.href = href
    link.download = name
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(href), 1000)
}
