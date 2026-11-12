import api, { AUTH_COOKIE as COOKIE_KEY } from '@/lib/axios'
import { setCookie, destroyCookie } from 'nookies'
import { mutate } from 'swr'

export async function login(identifier: string, password: string) {
    const { data } = await api.post('/login', { identifier, password })
    setCookie(null, COOKIE_KEY, data.data.token, { path: '/' })
    mutate('/me', data.data.user)
    return data
}

export async function register(
    name: string,
    username: string,
    email: string,
    password: string,
    password_confirmation?: string,
) {
    const { data } = await api.post('/register', {
        name,
        username,
        email,
        password,
        password_confirmation: password_confirmation ?? password,
    })
    setCookie(null, COOKIE_KEY, data.data.token, { path: '/' })
    return data
}

/**
 * REQ-010: the API revokes the token; the cookie goes either way, so a
 * failed request (e.g. an already expired token) still logs the user out.
 */
export async function logout() {
    try {
        await api.post('/logout')
    } finally {
        destroyCookie(null, COOKIE_KEY, { path: '/' })
        await mutate('/me', null, { revalidate: false })
    }
}