import { apiFetch } from "@/helpers/api-client"

export const swrFetcher = (url: string) => apiFetch(url).then((response) => response.data)