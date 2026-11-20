"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ChevronDown, LogOut, Settings, User } from "lucide-react"
import { logoutAction } from "@/app/actions/auth"

export function ProfileMenu({ userName }: { userName: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const initials =
    userName
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "AD"

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
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full p-0.5 hover:bg-muted"
        aria-label="Account menu"
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-olive text-sm font-semibold text-white">
          {initials}
        </span>
        <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-semibold">{userName}</p>
            <p className="text-xs text-muted-foreground">Catering Manager</p>
          </div>
          <div className="p-1">
            <Link
              href="/settings#profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
            >
              <User className="size-4" />
              Profile
            </Link>
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
            >
              <Settings className="size-4" />
              Settings
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
              >
                <LogOut className="size-4" />
                Log out
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
