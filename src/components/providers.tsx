'use client'

import { ProgressProvider } from '@bprogress/next/app'

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ProgressProvider color="#0EA5E9" options={{ showSpinner: false }} shallowRouting>
            {children}
        </ProgressProvider>
    )
}