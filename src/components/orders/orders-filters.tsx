"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { CalendarDays, CreditCard, Search, ShoppingBag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function OrdersFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (!value || value === "all") params.delete(key)
    else params.set(key, value)
    params.delete("page")
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className="mb-5 flex flex-col gap-3 rounded-xl border border-border bg-white p-4 lg:flex-row lg:items-end">
      <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <CalendarDays className="size-3.5" /> Date from
          </label>
          <Input
            type="date"
            defaultValue={searchParams.get("from") ?? ""}
            onChange={(e) => update("from", e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <CalendarDays className="size-3.5" /> Date to
          </label>
          <Input
            type="date"
            defaultValue={searchParams.get("to") ?? ""}
            onChange={(e) => update("to", e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <ShoppingBag className="size-3.5" /> Order type
          </label>
          <Select
            defaultValue={searchParams.get("type") ?? "all"}
            onChange={(e) => update("type", e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="food_delivery">Food Delivery</option>
            <option value="event_catering">Event Catering</option>
          </Select>
        </div>
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <CreditCard className="size-3.5" /> Payment status
          </label>
          <Select
            defaultValue={searchParams.get("payment") ?? "all"}
            onChange={(e) => update("payment", e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </Select>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:min-w-[320px]">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            className="pl-9"
            defaultValue={searchParams.get("q") ?? ""}
            onChange={(e) => update("q", e.target.value)}
          />
        </div>
        <Button render={<Link href="/orders/new" />} className="shrink-0">
          + New Order
        </Button>
      </div>

      {pending ? (
        <span className="sr-only" aria-live="polite">
          Filtering…
        </span>
      ) : null}
    </div>
  )
}
