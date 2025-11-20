import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"

import Sidebar from "@/components/partials/sidebar"
import Topbar from "@/components/partials/topbar"
import Providers from "@/components/providers"
import { ProgressiveBlur } from "@/components/progressive-blur"

const poppinsSans = Poppins({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
})

export const metadata: Metadata = {
    title: process.env.APP_NAME || "Bimbel Smart Portal",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis debitis quaerat dolor amet, repudiandae ipsum sunt, facere accusantium veritatis reprehenderit harum dolore? Dolores, laborum temporibus explicabo perspiciatis exercitationem quo incidunt."
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={`${poppinsSans.className} antialiased bg-neutral-50`}>
                <Providers>
                    <div className="flex">
                        <Sidebar />
                        <div className="ml-72 flex flex-col w-full bg-white min-h-screen mx-3 rounded-xl">
                            <Topbar />
                            <div className="px-4 pb-4 pt-8">
                                {children}
                            </div>
                        </div>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
