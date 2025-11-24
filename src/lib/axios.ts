import axios from 'axios'
import { parseCookies, destroyCookie } from 'nookies'

const api = axios.create({
    baseURL: process.env.API_URL,
})

api.interceptors.request.use(config => {
    const { bimbel_smart_auth_token } = parseCookies()
    if (bimbel_smart_auth_token) config.headers.Authorization = `Bearer ${bimbel_smart_auth_token}`
    return config
})

api.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {
            destroyCookie(null, 'bimbel_smart_auth_token')
            // if (typeof window !== 'undefined') window.location.href = '/login'
        }
        return Promise.reject(err)
    },
)

export default api