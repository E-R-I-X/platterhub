"use client"

import { useState } from "react"
import { Menu, Plus, Search } from "lucide-react"
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
  const [mobileSearch, setMobileSearch] = useState(false)
  const router = useRouter()

  function submitSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    router.push(q ? `/orders?q=${encodeURIComponent(q)}` : "/orders")
    setMobileSearch(false)
  }

  return (
    <div className="flex min-h-dvh bg-canvas">
      <Sidebar open={open} onClose={() => setOpen(false)} userName={userName} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border/80 bg-card/85 px-3 py-2.5 backdrop-blur-xl sm:px-4 md:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="rounded-xl p-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>

            <form
              className="relative hidden min-w-0 flex-1 md:block"
              onSubmit={submitSearch}
            >
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search orders, customers, menu..."
                className="h-11 max-w-xl rounded-xl border-border/80 bg-canvas/60 pl-10 shadow-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </form>

            <div className="ml-auto flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                className="rounded-xl p-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
                aria-label="Search"
                onClick={() => setMobileSearch((v) => !v)}
              >
                <Search className="size-5" />
              </button>
              <Button
                render={<Link href="/orders/new" />}
                className="hidden rounded-xl sm:inline-flex"
              >
                <Plus className="size-4" />
                New Order
              </Button>
              <Button
                render={<Link href="/orders/new" />}
                size="icon"
                className="rounded-xl sm:hidden"
                aria-label="New order"
              >
                <Plus className="size-4" />
              </Button>
              <NotificationsButton />
              <ProfileMenu userName={userName} />
            </div>
          </div>

          {mobileSearch ? (
            <form className="mt-2 md:hidden" onSubmit={submitSearch}>
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  autoFocus
                  placeholder="Search orders..."
                  className="h-11 rounded-xl bg-canvas/70 pl-9"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </form>
          ) : null}
        </header>

        <main className="relative flex-1 px-3 py-5 sm:px-4 md:px-6 lg:px-8 lg:py-7">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-24 left-1/4 size-[28rem] rounded-full bg-olive/8 blur-3xl" />
            <div className="absolute top-1/3 -right-20 size-[22rem] rounded-full bg-olive-muted/30 blur-3xl" />
          </div>
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
