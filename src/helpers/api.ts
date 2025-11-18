import { apiFetch } from "@/helpers/api-client"

export const apiGet = (url: string, params?: Record<string, any>) => {
    const query = params ? `?${new URLSearchParams(params)}` : ""
    return apiFetch(`${url}${query}`)
}

export const apiPost = (url: string, body?: any) =>
    apiFetch(url, {
        method: "POST",
        body: JSON.stringify(body),
    })

export const apiPut = (url: string, body?: any) =>
    apiFetch(url, {
        method: "PUT",
        body: JSON.stringify(body),
    })

export const apiDelete = (url: string) =>
    apiFetch(url, {
        method: "DELETE",
    })