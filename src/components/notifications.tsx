'use client'

import { useRouter } from "next/navigation"
import moment from "moment"

import { Popover as BasePopover, PopoverButton, PopoverPanel } from "@/components/base/popover"
import { Highlight, HighlightItem } from "@/components/base/highlight"
import { Bell, Calendar, Wallet, InfoCircle } from "@/components/icons/outline"
import { useNotification } from "@/hooks/repositories/use-notification"
import { useUser } from "@/hooks/use-user"
import api from "@/lib/axios"
import { cn } from "@/lib/utils"
import type { Notification } from "@/lib/types"

type Props = {
    children?: React.ReactNode
}

function renderIcon(icon?: string) {
    switch (icon) {
        case 'schedule':
        case 'jadwal':
            return <Calendar className="w-5 h-5" />
        case 'finance':
        case 'gaji':
            return <Wallet className="w-5 h-5" />
        default:
            return <InfoCircle className="w-5 h-5" />
    }
}

export default function Notifications({ children }: Props) {
    const router = useRouter()
    const { user } = useUser()

    // isLoading came from SWR all along; the component held its own
    // `useState(false)` instead, so the loading branch was unreachable.
    const { data: notifications, isLoading, error, mutate } = useNotification(user?.id ?? null)

    const unreadCount = notifications?.filter((n) => !n.is_read).length ?? 0

    /** Items had no click handler, and `link` / `is_read` were never used. */
    const handleOpen = async (item: Notification) => {
        if (!item.is_read) {
            // Optimistic — the badge should clear immediately.
            mutate(
                (current) => current?.map((n) => (n.id === item.id ? { ...n, is_read: true } : n)),
                { revalidate: false }
            )
            try {
                await api.patch(`/notification/${item.id}`, { is_read: true })
            } catch {
                mutate()
            }
        }

        if (item.link) router.push(item.link)
    }

    return (
        <BasePopover>
            <PopoverButton className="relative flex items-center cursor-pointer focus:outline-none p-2 rounded-xl bg-white border border-sky-200 hover:bg-sky-50 transition-colors">
                {children ?? <Bell className="text-sky-500 w-6 h-6" />}

                {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 inline-flex min-w-4 h-4 px-1 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white box-content">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
                <span className="sr-only">Notifikasi</span>
            </PopoverButton>

            <PopoverPanel
                anchor={{ to: "bottom end", gap: 8 }}
                className="w-96 bg-white border border-neutral-200 p-1 z-50 rounded-xl text-sm shadow-xl"
            >
                <div className="px-3 py-2 font-semibold mb-1 flex items-center justify-between">
                    <span>Notifikasi</span>
                    {unreadCount > 0 && (
                        <span className="text-xs font-medium text-neutral-500">{unreadCount} belum dibaca</span>
                    )}
                </div>

                <Highlight hover controlledItems className="bg-neutral-100 rounded-lg inset-0 max-h-[400px] overflow-y-auto">
                    {isLoading ? (
                        <div className="p-6 text-center text-neutral-400 text-xs">Memuat notifikasi…</div>
                    ) : error ? (
                        <div className="p-6 text-center text-red-500 text-xs">Gagal memuat notifikasi</div>
                    ) : notifications && notifications.length > 0 ? (
                        notifications.map((item) => (
                            <HighlightItem key={item.id}>
                                <button
                                    type="button"
                                    onClick={() => handleOpen(item)}
                                    className="flex w-full text-left cursor-pointer items-start gap-3 p-3 transition-colors rounded-lg"
                                >
                                    <div className={cn('mt-0.5 shrink-0', item.is_read ? 'text-neutral-400' : 'text-sky-500')}>
                                        {renderIcon(item.icon)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline gap-2 mb-0.5">
                                            <p className={cn('text-sm truncate', item.is_read ? 'font-medium text-neutral-600' : 'font-semibold text-neutral-900')}>
                                                {item.title}
                                            </p>
                                            <p className="text-[10px] text-neutral-400 whitespace-nowrap">
                                                {moment(item.created_at).fromNow()}
                                            </p>
                                        </div>
                                        <p className="text-sm text-neutral-600 leading-snug">{item.message}</p>
                                    </div>
                                    {!item.is_read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sky-500" />}
                                </button>
                            </HighlightItem>
                        ))
                    ) : (
                        <div className="p-8 text-center text-neutral-400 text-xs">Tidak ada notifikasi</div>
                    )}
                </Highlight>
            </PopoverPanel>
        </BasePopover>
    )
}
