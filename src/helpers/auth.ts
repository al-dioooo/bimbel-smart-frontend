import api from '@/lib/axios'
import { setCookie, destroyCookie } from 'nookies'
import { mutate } from 'swr'

const COOKIE_KEY = 'bimbel_smart_auth_token'

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

export async function logout() {
    return api.post('/logout').then(() => destroyCookie(null, COOKIE_KEY, { path: '/' }))
}