"use client"

import Link from "next/link"
import { Bell, CheckCheck, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
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
  const ref = useRef<HTMLDivElement>(null)
  const unread = items.filter((n) => !n.read).length

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted"
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
      >
        <Bell className="size-5" />
        {unread > 0 ? (
          <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-olive text-[10px] font-bold text-white">
            {unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="font-semibold">Notifications</p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                title="Mark all read"
                onClick={() =>
                  setItems((prev) => prev.map((n) => ({ ...n, read: true })))
                }
              >
                <CheckCheck className="size-4" />
              </button>
              <button
                type="button"
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">
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
                    "block border-b border-border px-4 py-3 hover:bg-muted/60",
                    !n.read && "bg-olive-soft/40"
                  )}
                >
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{n.createdAt}</p>
                </Link>
              ))
            )}
          </div>
          <div className="border-t border-border px-4 py-2 text-center">
            <Link
              href="/settings#notifications"
              className="text-xs font-medium text-olive hover:underline"
              onClick={() => setOpen(false)}
            >
              Notification settings
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  )
}
