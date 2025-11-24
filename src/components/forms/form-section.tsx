type Props = {
    children: React.ReactNode

    title: string
    description?: string

    disablePadding?: boolean
}

export default function FormSection({ children, title, description, disablePadding = false }: Props) {
    return (
        <div className="mt-10 sm:mt-0">
            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
                        <p className="mt-1 text-sm text-gray-600">{description}</p>
                    </div>
                </div>
                <div className="mt-5 md:col-span-2 md:mt-0">
                    <div className={`${disablePadding ? '' : 'border sm:rounded-xl p-4 sm:p-6'}`}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}