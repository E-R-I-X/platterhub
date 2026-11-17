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
  HelpCircle,
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
          "fixed inset-0 z-40 bg-black/30 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-5">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <div className="flex size-10 items-center justify-center rounded-full bg-olive text-white">
              <ChefHat className="size-5" />
            </div>
            <div>
              <p className="font-display text-lg leading-tight font-semibold tracking-tight text-foreground">
                The Platter Hub
              </p>
              <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                Catering
              </p>
            </div>
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
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
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-olive-soft text-olive"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto space-y-3 border-t border-sidebar-border p-4">
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <HelpCircle className="size-4" />
            Help & Support
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Settings className="size-4" />
            Settings
          </Link>

          <div className="flex items-center gap-3 rounded-xl border border-border bg-olive-soft/40 px-3 py-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-olive text-sm font-semibold text-white">
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
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
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
