import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import Sidebar from "@/components/partials/sidebar";
import Topbar from "@/components/partials/topbar";

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
                <div className="flex">
                    <Sidebar />
                    <div className="ml-72 flex flex-col w-full bg-white min-h-screen m-3 rounded-xl">
                        <Topbar />
                        <div className="p-4">
                            {children}
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
