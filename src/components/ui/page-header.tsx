type Props = {
    title: string
    description?: string
    /** Rendered on the right — usually a primary action. */
    action?: React.ReactNode
}

/** Every dashboard page opens with this, at one consistent size. */
export default function PageHeader({ title, description, action }: Props) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                <h1 className="text-3xl font-semibold">{title}</h1>
                {description && (
                    <p className="mt-1 text-sm text-neutral-500">{description}</p>
                )}
            </div>
            {action}
        </div>
    )
}
