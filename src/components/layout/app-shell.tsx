"use client"

import { useState } from "react"
import { Bell, Menu, Search } from "lucide-react"
import Link from "next/link"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function AppShell({
  children,
  userName,
}: {
  children: React.ReactNode
  userName: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar open={open} onClose={() => setOpen(false)} userName={userName} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-white/90 px-4 py-3 backdrop-blur md:px-6">
          <button
            type="button"
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>

          <div className="relative hidden min-w-0 flex-1 md:block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search orders, customers, menu..."
              className="h-10 max-w-xl pl-9"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button
              render={<Link href="/orders/new" />}
              className="hidden sm:inline-flex"
            >
              + New Order
            </Button>
            <button
              type="button"
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
              aria-label="Notifications"
            >
              <Bell className="size-5" />
            </button>
            <div className="flex size-9 items-center justify-center rounded-full bg-olive text-sm font-semibold text-white">
              {userName
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("")
                .toUpperCase() || "AD"}
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
