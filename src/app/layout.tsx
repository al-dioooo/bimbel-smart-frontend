import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"

import Providers from "@/components/providers"

const poppins = Poppins({
    subsets: ["latin"],
    display: "swap",
    weight: ["400", "500", "600"],
    variable: "--font-poppins",
})

export const metadata: Metadata = {
    title: process.env.APP_NAME || "Bimbel Smart Portal",
    description:
        "Portal administrasi Bimbel Smart — kelola jadwal, absensi, data siswa dan mentor, serta rekap gaji dalam satu tempat.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="id">
            <body className={`${poppins.className} antialiased bg-neutral-50 text-neutral-900`}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    )
}
