import axios from 'axios'
import { mutate } from 'swr'

/** Same-origin route handlers that set and clear the HttpOnly session cookie. */
const auth = axios.create({ baseURL: '/api/auth' })

export async function login(identifier: string, password: string) {
    const { data } = await auth.post('/login', { identifier, password })
    await mutate('/me', data.data.user, { revalidate: false })
    return data
}

/**
 * REQ-010: the route handler revokes the token on the API and drops the
 * cookie whatever the API answers. Only when the route handler itself cannot
 * be reached is the cookie still set; then this returns false and the user
 * stays signed in, since the login page would send them straight back.
 */
export async function logout(): Promise<boolean> {
    try {
        await auth.post('/logout')
    } catch {
        return false
    }
    await mutate('/me', null, { revalidate: false })
    return true
}
