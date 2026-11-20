"use client"

import Link from "next/link"
import { Bell, CheckCheck } from "lucide-react"
import { useState } from "react"
import { Overlay, OverlayHeader } from "@/components/ui/overlay"
import { cn } from "@/lib/utils"

export type AppNotification = {
  id: string
  title: string
  body: string
  href?: string
  read: boolean
  createdAt: string
}

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    title: "Balance due reminder",
    body: "ORD-1065 still has an outstanding balance.",
    href: "/orders/ord-7",
    read: false,
    createdAt: "Just now",
  },
  {
    id: "n2",
    title: "Upcoming catering event",
    body: "Greenwood School event is scheduled for Nov 28.",
    href: "/orders/ord-5",
    read: false,
    createdAt: "2h ago",
  },
  {
    id: "n3",
    title: "Order confirmed",
    body: "ORD-1068 was marked paid.",
    href: "/orders/ord-8",
    read: true,
    createdAt: "Yesterday",
  },
]

export function NotificationsButton() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<AppNotification[]>(DEFAULT_NOTIFICATIONS)
  const unread = items.filter((n) => !n.read).length

  return (
    <>
      <button
        type="button"
        className="relative rounded-xl p-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Bell className="size-5" />
        {unread > 0 ? (
          <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-olive text-[10px] font-bold text-white ring-2 ring-card">
            {unread}
          </span>
        ) : null}
      </button>

      <Overlay
        open={open}
        onClose={() => setOpen(false)}
        placement="bottom"
        className="md:items-start md:justify-end md:p-0 md:pt-16 md:pr-6 lg:pr-10"
        panelClassName="h-[min(88dvh,36rem)] max-h-[88dvh] max-w-none md:h-auto md:max-h-[min(32rem,75vh)] md:w-[24rem] md:rounded-2xl"
      >
        <OverlayHeader
          title="Notifications"
          description="Order and payment updates"
          onClose={() => setOpen(false)}
        />
        <div className="flex shrink-0 items-center justify-end px-4 py-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={() =>
              setItems((prev) => prev.map((n) => ({ ...n, read: true })))
            }
          >
            <CheckCheck className="size-3.5" />
            Mark all read
          </button>
        </div>
        <div className="min-h-[12rem] flex-1 overflow-y-auto overscroll-contain">
          {items.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              No notifications
            </p>
          ) : (
            items.map((n) => (
              <Link
                key={n.id}
                href={n.href || "/dashboard"}
                onClick={() => {
                  setItems((prev) =>
                    prev.map((item) =>
                      item.id === n.id ? { ...item, read: true } : item
                    )
                  )
                  setOpen(false)
                }}
                className={cn(
                  "block border-b border-border px-4 py-3.5 transition-colors hover:bg-muted/70",
                  !n.read && "bg-olive-soft/50"
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-1.5 size-2 shrink-0 rounded-full",
                      !n.read ? "bg-olive" : "bg-transparent"
                    )}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {n.body}
                    </p>
                    <p className="mt-1.5 text-[11px] text-muted-foreground/80">
                      {n.createdAt}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
        <div className="shrink-0 border-t border-border px-4 py-3 text-center">
          <Link
            href="/settings#notifications"
            className="text-xs font-medium text-olive hover:underline"
            onClick={() => setOpen(false)}
          >
            Notification settings
          </Link>
        </div>
      </Overlay>
    </>
  )
}
