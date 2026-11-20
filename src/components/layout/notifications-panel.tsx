"use client"

import Link from "next/link"
import { Bell, CheckCheck, X } from "lucide-react"
import { useEffect, useState } from "react"
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

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

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

      {open ? (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            aria-label="Close notifications"
            onClick={() => setOpen(false)}
          />

          {/* Mobile: bottom sheet */}
          <div className="absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col overflow-hidden rounded-t-3xl border border-border bg-card shadow-2xl md:hidden">
            <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-border" />
            <PanelHeader
              onClose={() => setOpen(false)}
              onMarkAll={() =>
                setItems((prev) => prev.map((n) => ({ ...n, read: true })))
              }
            />
            <NotificationList
              items={items}
              setItems={setItems}
              onClose={() => setOpen(false)}
            />
          </div>

          {/* Desktop: anchored dropdown under header actions */}
          <div className="absolute top-16 right-4 hidden w-[min(100vw-2rem,24rem)] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl md:block lg:right-8">
            <PanelHeader
              onClose={() => setOpen(false)}
              onMarkAll={() =>
                setItems((prev) => prev.map((n) => ({ ...n, read: true })))
              }
            />
            <NotificationList
              items={items}
              setItems={setItems}
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </>
  )
}

function PanelHeader({
  onClose,
  onMarkAll,
}: {
  onClose: () => void
  onMarkAll: () => void
}) {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
      <div>
        <p className="font-semibold tracking-tight">Notifications</p>
        <p className="text-xs text-muted-foreground">Order and payment updates</p>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="Mark all read"
          onClick={onMarkAll}
        >
          <CheckCheck className="size-4" />
        </button>
        <button
          type="button"
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  )
}

function NotificationList({
  items,
  setItems,
  onClose,
}: {
  items: AppNotification[]
  setItems: React.Dispatch<React.SetStateAction<AppNotification[]>>
  onClose: () => void
}) {
  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain md:max-h-[min(24rem,60vh)]">
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
                onClose()
              }}
              className={cn(
                "block border-b border-border px-4 py-3.5 transition-colors hover:bg-muted/70",
                !n.read && "bg-olive-soft/50"
              )}
            >
              <div className="flex items-start gap-3">
                {!n.read ? (
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-olive" />
                ) : (
                  <span className="mt-1.5 size-2 shrink-0" />
                )}
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
      <div className="border-t border-border px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <Link
          href="/settings#notifications"
          className="text-xs font-medium text-olive hover:underline"
          onClick={onClose}
        >
          Notification settings
        </Link>
      </div>
    </>
  )
}
