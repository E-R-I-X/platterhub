"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ShoppingBag,
  CalendarDays,
  UtensilsCrossed,
  Wallet,
  Users,
  Settings,
  LogOut,
  X,
  ChefHat,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { logoutAction } from "@/app/actions/auth"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/orders", label: "Orders", icon: ShoppingBag },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/finance", label: "Finance", icon: Wallet },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar({
  open,
  onClose,
  userName,
  userRole = "Catering Manager",
}: {
  open: boolean
  onClose: () => void
  userName: string
  userRole?: string
}) {
  const pathname = usePathname()

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px] transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[min(100vw-3rem,18rem)] flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:static lg:w-72 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-5 sm:px-5">
          <Link href="/dashboard" className="flex min-w-0 items-center gap-3" onClick={onClose}>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-olive text-white shadow-sm">
              <ChefHat className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="font-display truncate text-lg leading-tight font-semibold tracking-tight text-foreground">
                The Platter Hub
              </p>
              <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                Catering
              </p>
            </div>
          </Link>
          <button
            type="button"
            className="rounded-xl p-2 text-muted-foreground hover:bg-muted lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-1">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-olive-soft text-olive shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className={cn("size-4", active && "text-olive")} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto space-y-3 border-t border-sidebar-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-olive-soft/50 px-3 py-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-olive text-sm font-semibold text-white">
              {userName
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{userName}</p>
              <p className="truncate text-xs text-muted-foreground">{userRole}</p>
            </div>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="size-4" />
              Log out
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
