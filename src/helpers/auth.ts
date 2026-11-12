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
 * cookie whatever the API answers, so a failed call still logs the user out.
 */
export async function logout() {
    try {
        await auth.post('/logout')
    } finally {
        await mutate('/me', null, { revalidate: false })
    }
}
