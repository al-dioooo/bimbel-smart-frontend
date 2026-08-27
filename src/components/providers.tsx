'use client'

import { ProgressProvider } from '@bprogress/next/app'
import { Toaster } from 'sonner'

import { UserProvider } from '@/hooks/use-user'
// Registers the Indonesian moment locale for the whole client bundle.
import '@/lib/format'

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ProgressProvider color="#0EA5E9" options={{ showSpinner: false }} shallowRouting>
            <UserProvider>
                {children}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        className:
                            'rounded-xl border border-neutral-200 bg-white text-sm text-neutral-900 shadow-lg',
                    }}
                />
            </UserProvider>
        </ProgressProvider>
    )
}
