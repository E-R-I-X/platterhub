"use client"

import { useMemo, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Filter, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { cn } from "@/lib/utils"

type Draft = {
  q: string
  customer: string
  address: string
  from: string
  to: string
  type: string
  payment: string
  status: string
  schedule: string
}

function draftFromParams(params: URLSearchParams): Draft {
  return {
    q: params.get("q") ?? "",
    customer: params.get("customer") ?? "",
    address: params.get("address") ?? "",
    from: params.get("from") ?? "",
    to: params.get("to") ?? "",
    type: params.get("type") ?? "all",
    payment: params.get("payment") ?? "all",
    status: params.get("status") ?? "all",
    schedule: params.get("schedule") ?? "all",
  }
}

function countActive(draft: Draft) {
  let n = 0
  if (draft.q) n++
  if (draft.customer) n++
  if (draft.address) n++
  if (draft.from) n++
  if (draft.to) n++
  if (draft.type && draft.type !== "all") n++
  if (draft.payment && draft.payment !== "all") n++
  if (draft.status && draft.status !== "all") n++
  if (draft.schedule && draft.schedule !== "all") n++
  return n
}

export function OrdersFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const applied = useMemo(() => draftFromParams(searchParams), [searchParams])
  const [draft, setDraft] = useState<Draft>(applied)
  const activeCount = countActive(applied)

  function openPanel() {
    setDraft(draftFromParams(searchParams))
    setOpen(true)
  }

  function apply() {
    const params = new URLSearchParams()
    Object.entries(draft).forEach(([key, value]) => {
      if (!value || value === "all") return
      params.set(key, value)
    })
    startTransition(() => {
      router.push(params.toString() ? `${pathname}?${params}` : pathname)
      setOpen(false)
    })
  }

  function clearAll() {
    setDraft({
      q: "",
      customer: "",
      address: "",
      from: "",
      to: "",
      type: "all",
      payment: "all",
      status: "all",
      schedule: "all",
    })
    startTransition(() => {
      router.push(pathname)
      setOpen(false)
    })
  }

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            className="pl-9"
            defaultValue={applied.q}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams.toString())
              if (e.target.value) params.set("q", e.target.value)
              else params.delete("q")
              params.delete("page")
              startTransition(() => {
                router.push(
                  params.toString() ? `${pathname}?${params}` : pathname
                )
              })
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openPanel}
            className={cn(
              "relative inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-white px-3 text-sm font-medium text-foreground hover:bg-muted dark:bg-card",
              activeCount > 0 && "border-olive text-olive"
            )}
          >
            <Filter className="size-4" />
            Filters
            {activeCount > 0 ? (
              <span className="flex size-5 items-center justify-center rounded-full bg-olive text-[11px] font-bold text-white">
                {activeCount}
              </span>
            ) : null}
          </button>
          <Button render={<Link href="/orders/new" />} className="shrink-0">
            + New Order
          </Button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center md:items-stretch md:justify-end">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            aria-label="Close filters"
            onClick={() => setOpen(false)}
          />
          <aside className="relative z-10 flex max-h-[92dvh] w-full max-w-md flex-col rounded-t-3xl border border-border bg-card shadow-2xl md:my-4 md:mr-4 md:max-h-[calc(100dvh-2rem)] md:rounded-3xl">
            <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-border md:hidden" />
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold">Filters</h2>
                <p className="text-xs text-muted-foreground">
                  Narrow orders by date, type, payment, and more
                </p>
              </div>
              <button
                type="button"
                className="rounded-xl p-2 hover:bg-muted"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="from">Date from</Label>
                  <Input
                    id="from"
                    type="date"
                    value={draft.from}
                    onChange={(e) => setDraft({ ...draft, from: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="to">Date to</Label>
                  <Input
                    id="to"
                    type="date"
                    value={draft.to}
                    onChange={(e) => setDraft({ ...draft, to: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="type">Order type</Label>
                <Select
                  id="type"
                  value={draft.type}
                  onChange={(e) => setDraft({ ...draft, type: e.target.value })}
                >
                  <option value="all">All</option>
                  <option value="food_delivery">Food Delivery</option>
                  <option value="event_catering">Event Catering</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="payment">Payment status</Label>
                <Select
                  id="payment"
                  value={draft.payment}
                  onChange={(e) => setDraft({ ...draft, payment: e.target.value })}
                >
                  <option value="all">All</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Order status</Label>
                <Select
                  id="status"
                  value={draft.status}
                  onChange={(e) => setDraft({ ...draft, status: e.target.value })}
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="schedule">Schedule</Label>
                <Select
                  id="schedule"
                  value={draft.schedule}
                  onChange={(e) => setDraft({ ...draft, schedule: e.target.value })}
                >
                  <option value="all">All</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="customer">Customer name</Label>
                <Input
                  id="customer"
                  value={draft.customer}
                  placeholder="Search by customer"
                  onChange={(e) => setDraft({ ...draft, customer: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={draft.address}
                  placeholder="Partial address match"
                  onChange={(e) => setDraft({ ...draft, address: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="q">Free text search</Label>
                <Input
                  id="q"
                  value={draft.q}
                  placeholder="Order #, phone, notes, theme…"
                  onChange={(e) => setDraft({ ...draft, q: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
                onClick={clearAll}
              >
                Clear all
              </button>
              <Button onClick={apply} disabled={pending}>
                {pending ? "Applying…" : "Apply Filters"}
              </Button>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  )
}
