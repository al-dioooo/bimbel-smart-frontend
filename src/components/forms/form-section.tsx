type Props = {
    children: React.ReactNode

    title: string
    description?: string

    disablePadding?: boolean
}

export default function FormSection({ children, title, description, disablePadding = false }: Props) {
    return (
        <div className="sm:mt-0">
            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <div className="px-0">
                        <h2 className="text-lg font-semibold leading-6 text-neutral-900">{title}</h2>
                        {description && <p className="mt-1 text-sm text-neutral-500">{description}</p>}
                    </div>
                </div>
                <div className="mt-5 md:col-span-2 md:mt-0">
                    <div className={disablePadding ? '' : 'border border-neutral-200 bg-white rounded-xl p-4 sm:p-6'}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
