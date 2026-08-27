import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Masuk — Bimbel Smart Portal",
    description: "Masuk ke portal administrasi Bimbel Smart.",
}

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <>{children}</>
}
