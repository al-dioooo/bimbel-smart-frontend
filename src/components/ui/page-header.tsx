type Props = {
    title: string
    description?: string
    /** Rendered on the right — usually a primary action. */
    action?: React.ReactNode
}

/** Every dashboard page opens with this, at one consistent size. */
export default function PageHeader({ title, description, action }: Props) {
    return (
        <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-semibold break-words">{title}</h1>
                {description && (
                    <p className="mt-1 text-sm text-neutral-500">{description}</p>
                )}
            </div>
            {action}
        </div>
    )
}
