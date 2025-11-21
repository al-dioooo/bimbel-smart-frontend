import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "../globals.css"

const poppinsSans = Poppins({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
})

export const metadata: Metadata = {
    title: process.env.APP_NAME || "Bimbel Smart Portal",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis debitis quaerat dolor amet, repudiandae ipsum sunt, facere accusantium veritatis reprehenderit harum dolore? Dolores, laborum temporibus explicabo perspiciatis exercitationem quo incidunt."
}

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div>
            {children}
        </div>
    )
}