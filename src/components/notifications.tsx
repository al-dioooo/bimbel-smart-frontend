'use client'
import { useState } from "react"
import { Popover as BasePopover, PopoverButton, PopoverPanel } from "@/components/base/popover"
import { Highlight, HighlightItem } from "@/components/base/highlight"
import { Bell, Calendar, Wallet, InfoCircle } from "@/components/icons/outline"
import { useNotification } from "@/hooks/repositories/use-notification"
import { useUser } from "@/hooks/use-user"
import moment from "moment"

type NotificationType = 'schedule' | 'finance' | 'info' | any

interface NotificationItem {
    id: string | number
    title: string
    message: string
    date: string
    type: NotificationType
    isRead: boolean
}

const MOCK_DATA: NotificationItem[] = [
    {
        id: 1,
        title: "Jadwal",
        message: "Pengajuan jadwal hari kamis disetujui",
        date: "6 Oktober 2025",
        type: "schedule",
        isRead: false
    },
    {
        id: 2,
        title: "Gaji",
        message: "Rekap gaji sudah turn",
        date: "4 Oktober 2025",
        type: "finance",
        isRead: false
    }
]

type Props = {
    children?: React.ReactNode
}

export default function Notifications({ children }: Props) {
    const { user } = useUser()
    const { data: notifications } = useNotification(user?.id ?? 0)

    // const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_DATA)
    const [isLoading, setIsLoading] = useState(false)

    const hasUnread = notifications?.some(n => !n.is_read)

    const renderIcon = (type: NotificationType) => {
        switch (type) {
            case 'schedule': return <Calendar className="w-5 h-5" />
            case 'finance': return <Wallet className="w-5 h-5" />
            default: return <InfoCircle className="w-5 h-5" />
        }
    }

    return (
        <BasePopover>
            <PopoverButton className="relative flex items-center cursor-pointer focus:outline-none p-2 rounded-xl bg-white/80 border border-sky-200 hover:bg-sky-50 transition-colors">
                {children ? (
                    children
                ) : (
                    <Bell className="text-sky-500 w-6 h-6" />
                )}

                {hasUnread && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
                    </span>
                )}
            </PopoverButton>

            {/* Notifications Panel */}
            <PopoverPanel anchor={{ to: "bottom end", gap: 8 }} className="w-96 bg-background border p-1 z-50 rounded-xl text-sm shadow-xl">
                <div className="px-3 py-2 font-semibold mb-1">
                    Notifikasi
                </div>

                <Highlight hover controlledItems className="bg-neutral-100 rounded-lg inset-0 max-h-[400px] overflow-y-auto">
                    {isLoading ? (
                        <div className="p-4 text-center text-neutral-400 text-xs">Loading...</div>
                    ) : (notifications && notifications?.length > 0) ? (
                        notifications?.map((item) => (
                            <HighlightItem key={item.id}>
                                <div className="flex w-full cursor-pointer items-start space-x-3 p-3 transition-colors rounded-lg">
                                    <div className="mt-0.5 shrink-0 text-neutral-900">
                                        {renderIcon(item.icon)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <p className="text-sm font-semibold text-neutral-900 truncate pr-2">
                                                {item.title}
                                            </p>
                                            <p className="text-[10px] text-neutral-400 whitespace-nowrap">
                                                {moment(item.created_at).format('MMMM D, YYYY')}
                                            </p>
                                        </div>
                                        <p className="text-sm text-neutral-600 leading-snug">
                                            {item.message}
                                        </p>
                                    </div>
                                </div>
                            </HighlightItem>
                        ))
                    ) : (
                        <div className="p-8 text-center text-neutral-400 text-xs">
                            Tidak ada notifikasi baru
                        </div>
                    )}
                </Highlight>
            </PopoverPanel>
        </BasePopover>
    )
}