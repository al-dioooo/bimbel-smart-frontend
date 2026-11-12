import axios from 'axios'
import { parseCookies, destroyCookie } from 'nookies'

export const AUTH_COOKIE = 'bimbel_smart_auth_token'

/** Pages that work without a session; a 401 there is not an expired session. */
const PUBLIC_PATHS = ['/login', '/lupa-kata-sandi', '/reset-password']

export const isPublicPath = (pathname: string) =>
    PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))

const api = axios.create({
    baseURL: process.env.API_URL,
})

api.interceptors.request.use(config => {
    const { [AUTH_COOKIE]: token } = parseCookies()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

api.interceptors.response.use(
    res => res,
    err => {
        // REQ-016/REQ-017: the API rejects a token after logout or 30 idle
        // minutes. Drop it and go back to the login page instead of leaving
        // every widget failing on its own.
        if (err.response?.status === 401) {
            destroyCookie(null, AUTH_COOKIE, { path: '/' })
            if (typeof window !== 'undefined' && !isPublicPath(window.location.pathname)) {
                window.location.replace('/login?sesi=berakhir')
            }
        }
        return Promise.reject(err)
    },
)

export default api
