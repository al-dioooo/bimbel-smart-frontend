'use client'

import { createContext, useContext, type ReactNode } from 'react'
import useSWR, { type KeyedMutator } from 'swr'
import type { User } from '@/lib/types'
import { fetcher } from '@/lib/fetcher'

// Sanctum-friendly fetcher
// const fetcher = async (url: string): Promise<User | null> => {
//     const res = await fetch(url, {
//         credentials: 'include', // send auth_token cookie
//     })

//     if (res.status === 401) return null
//     if (!res.ok) throw new Error('Failed to fetch /me')

//     return res.json()
// }

type UserContextValue = {
    user: User | null
    isLoading: boolean
    isError: boolean
    mutateUser: KeyedMutator<User | null>
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
    const { data, error, isLoading, mutate } = useSWR<User | null>(
        '/me',
        fetcher,
        {
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
        }
    )

    const value: UserContextValue = {
        user: data ?? null,
        isLoading,
        isError: !!error,
        mutateUser: mutate,
    }

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
    const ctx = useContext(UserContext)
    if (!ctx) {
        throw new Error('useUser must be used inside <UserProvider>')
    }
    return ctx
}