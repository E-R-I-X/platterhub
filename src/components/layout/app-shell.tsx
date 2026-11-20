"use client"

import { useState } from "react"
import { Menu, Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { NotificationsButton } from "@/components/layout/notifications-panel"
import { ProfileMenu } from "@/components/layout/profile-menu"
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
  const [query, setQuery] = useState("")
  const router = useRouter()

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar open={open} onClose={() => setOpen(false)} userName={userName} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card/90 px-4 py-3 backdrop-blur md:px-6">
          <button
            type="button"
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>

          <form
            className="relative hidden min-w-0 flex-1 md:block"
            onSubmit={(e) => {
              e.preventDefault()
              const q = query.trim()
              router.push(q ? `/orders?q=${encodeURIComponent(q)}` : "/orders")
            }}
          >
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search orders, customers, menu..."
              className="h-10 max-w-xl pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>

          <div className="ml-auto flex items-center gap-2">
            <Button
              render={<Link href="/orders/new" />}
              className="hidden sm:inline-flex"
            >
              + New Order
            </Button>
            <NotificationsButton />
            <ProfileMenu userName={userName} />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
