"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronDown, LogOut, Settings, User, X } from "lucide-react"
import { logoutAction } from "@/app/actions/auth"
import { Overlay } from "@/components/ui/overlay"

export function ProfileMenu({ userName }: { userName: string }) {
  const [open, setOpen] = useState(false)
  const initials =
    userName
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "AD"

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

      <Overlay
        open={open}
        onClose={() => setOpen(false)}
        placement="bottom"
        className="md:items-start md:justify-end md:p-0 md:pt-16 md:pr-6 lg:pr-10"
        panelClassName="max-w-none md:w-64 md:max-w-none md:rounded-2xl"
      >
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <span className="flex size-11 items-center justify-center rounded-full bg-olive text-sm font-semibold text-white">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{userName}</p>
            <p className="text-xs text-muted-foreground">Catering Manager</p>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="space-y-1 p-2">
          <Link
            href="/settings#profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors hover:bg-muted"
          >
            <User className="size-4 text-olive" />
            Profile
          </Link>
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
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
      </Overlay>
    </>
  )
}
