import axios from 'axios'

/** Pages that work without a session; a 401 there is not an expired session. */
const PUBLIC_PATHS = ['/login', '/lupa-kata-sandi', '/reset-password']

export const isPublicPath = (pathname: string) =>
    PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))

/**
 * Every API call goes through the same-origin route handler at
 * /api/backend, which adds the token from the HttpOnly cookie (N2). Browser
 * code never sees the token.
 */
const api = axios.create({
    baseURL: '/api/backend',
})

api.interceptors.response.use(
    res => res,
    err => {
        // REQ-016/REQ-017: the API rejects a token after logout or 30 idle
        // minutes; the route handler has already dropped the cookie.
        if (err.response?.status === 401 && typeof window !== 'undefined' && !isPublicPath(window.location.pathname)) {
            window.location.replace('/login?sesi=berakhir')
        }
        return Promise.reject(err)
    },
)

export default api
