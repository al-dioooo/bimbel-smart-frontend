import Image from "next/image"

import LogoImage from "../../public/logo.png"

/** The login page's frame (brand panel + card), shared by the password pages. */
export default function AuthShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            <div
                className="hidden md:flex items-center justify-center"
                style={{ background: "linear-gradient(-135deg, #F0F9FF 0%, #DFF2FE 50%, #74D4FF 100%)" }}
            >
                <Image src={LogoImage} alt="Logo Bimbel Smart" className="w-64 h-auto" priority />
            </div>

            <div className="flex items-center justify-center bg-neutral-50 p-6">
                <div className="max-w-md w-full bg-white border border-neutral-200 rounded-xl p-8">
                    <div className="md:hidden flex justify-center mb-6">
                        <Image src={LogoImage} alt="Logo Bimbel Smart" className="w-32 h-auto" priority />
                    </div>

                    <h1 className="text-xl font-bold text-center mb-1">{title}</h1>
                    {subtitle && <p className="text-center text-sm text-neutral-500 mb-6">{subtitle}</p>}

                    {children}
                </div>
            </div>
        </div>
    )
}
