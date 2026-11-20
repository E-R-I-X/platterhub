"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ChevronDown, LogOut, Settings, User, X } from "lucide-react"
import { logoutAction } from "@/app/actions/auth"

export function ProfileMenu({ userName }: { userName: string }) {
  const [open, setOpen] = useState(false)
  const initials =
    userName
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "AD"

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
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full p-0.5 transition-colors hover:bg-muted"
        aria-label="Account menu"
        aria-expanded={open}
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-olive text-sm font-semibold text-white shadow-sm ring-2 ring-olive-soft">
          {initials}
        </span>
        <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            aria-label="Close account menu"
            onClick={() => setOpen(false)}
          />

          {/* Mobile bottom sheet */}
          <div className="absolute inset-x-0 bottom-0 overflow-hidden rounded-t-3xl border border-border bg-card shadow-2xl md:hidden">
            <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-border" />
            <div className="flex items-start justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-full bg-olive text-sm font-semibold text-white">
                  {initials}
                </span>
                <div>
                  <p className="font-semibold">{userName}</p>
                  <p className="text-xs text-muted-foreground">Catering Manager</p>
                </div>
              </div>
              <button
                type="button"
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                <X className="size-4" />
              </button>
            </div>
            <MenuLinks onClose={() => setOpen(false)} />
          </div>

          {/* Desktop dropdown */}
          <div className="absolute top-16 right-4 hidden w-64 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl md:block lg:right-8">
            <div className="border-b border-border px-4 py-3.5">
              <p className="truncate text-sm font-semibold">{userName}</p>
              <p className="text-xs text-muted-foreground">Catering Manager</p>
            </div>
            <MenuLinks onClose={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </>
  )
}

function MenuLinks({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-1 p-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <Link
        href="/settings#profile"
        onClick={onClose}
        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors hover:bg-muted"
      >
        <User className="size-4 text-olive" />
        Profile
      </Link>
      <Link
        href="/settings"
        onClick={onClose}
        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors hover:bg-muted"
      >
        <Settings className="size-4 text-olive" />
        Settings
      </Link>
      <form action={logoutAction}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors hover:bg-muted"
        >
          <LogOut className="size-4 text-olive" />
          Log out
        </button>
      </form>
    </div>
  )
}
