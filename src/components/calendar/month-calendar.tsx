"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns"
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatOrderType } from "@/lib/format"
import type { Order } from "@/lib/types"

export function MonthCalendar({
  orders,
  today,
}: {
  orders: Order[]
  today: string
}) {
  const todayDate = parseISO(today)
  const [cursor, setCursor] = useState(() => startOfMonth(todayDate))
  const [selected, setSelected] = useState<Date | null>(todayDate)

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor))
    const end = endOfWeek(endOfMonth(cursor))
    return eachDayOfInterval({ start, end })
  }, [cursor])

  const ordersByDate = useMemo(() => {
    const map = new Map<string, Order[]>()
    orders.forEach((order) => {
      const key = order.event_date
      const list = map.get(key) ?? []
      list.push(order)
      map.set(key, list)
    })
    return map
  }, [orders])

  const selectedKey = selected ? format(selected, "yyyy-MM-dd") : null
  const selectedOrders = selectedKey ? ordersByDate.get(selectedKey) ?? [] : []

  return (
    <div className="stagger-children space-y-5">
      <section className="relative overflow-hidden rounded-[1.75rem] border border-olive/20 text-white shadow-[0_20px_50px_-28px_rgba(28,36,20,0.45)]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 12% 20%, rgba(85,107,47,0.9), transparent 42%), linear-gradient(135deg, #1c2414 0%, #2f3d1c 55%, #556b2f 140%)",
          }}
        />
        <div className="relative flex flex-col gap-4 px-5 py-7 sm:flex-row sm:items-end sm:justify-between sm:px-7">
          <div>
            <p className="text-xs tracking-[0.2em] text-olive-muted uppercase">Schedule</p>
            <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Calendar
            </h1>
            <p className="mt-2 max-w-lg text-sm text-white/75">
              See deliveries and catering events across the month.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-white/25 bg-white/5 text-white hover:bg-white/10"
              onClick={() => {
                setCursor(startOfMonth(todayDate))
                setSelected(todayDate)
              }}
            >
              Today
            </Button>
            <Button
              render={<Link href="/orders/new" />}
              className="bg-white text-foreground hover:bg-olive-soft"
            >
              <Plus className="size-4" />
              Add Order
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <div className="surface-card p-4 md:p-5">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <p className="mr-auto font-display text-xl font-semibold tracking-tight">
              {format(cursor, "MMMM yyyy")}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="rounded-xl border border-border p-2 transition-colors hover:bg-muted"
                onClick={() => setCursor((d) => subMonths(d, 1))}
                aria-label="Previous month"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                className="rounded-xl border border-border p-2 transition-colors hover:bg-muted"
                onClick={() => setCursor((d) => addMonths(d, 1))}
                aria-label="Next month"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-2xl border border-border bg-border">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="bg-canvas px-2 py-2 text-center text-xs font-medium tracking-wide text-muted-foreground uppercase"
              >
                {day}
              </div>
            ))}
            {days.map((day) => {
              const key = format(day, "yyyy-MM-dd")
              const dayOrders = ordersByDate.get(key) ?? []
              const inMonth = isSameMonth(day, cursor)
              const isSelected = selected ? isSameDay(day, selected) : false
              const isToday = isSameDay(day, todayDate)
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelected(day)}
                  className={`min-h-20 bg-card p-2 text-left transition-all duration-200 hover:bg-olive-soft/50 sm:min-h-24 ${
                    !inMonth ? "bg-canvas/70 text-muted-foreground" : ""
                  } ${isSelected ? "bg-olive-soft ring-2 ring-olive ring-inset" : ""}`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span
                      className={`text-sm font-medium ${
                        isToday
                          ? "inline-flex size-6 items-center justify-center rounded-full bg-olive text-on-olive"
                          : ""
                      }`}
                    >
                      {format(day, "d")}
                    </span>
                    {dayOrders.length > 0 ? (
                      <span className="size-1.5 rounded-full bg-olive" />
                    ) : null}
                  </div>
                  <div className="hidden space-y-1 sm:block">
                    {dayOrders.slice(0, 2).map((order) => (
                      <p
                        key={order.id}
                        className="truncate rounded-md bg-olive-soft px-1.5 py-0.5 text-[10px] font-medium text-olive"
                      >
                        {order.order_type === "food_delivery" ? "Delivery" : "Catering"}
                      </p>
                    ))}
                    {dayOrders.length > 2 ? (
                      <p className="text-[10px] text-muted-foreground">
                        +{dayOrders.length - 2} more
                      </p>
                    ) : null}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="size-2 rounded-full bg-olive" />
            Scheduled event
          </div>
        </div>

        <aside className="surface-card p-5">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="font-semibold tracking-tight">
                {selected ? format(selected, "MMMM d, yyyy") : "Select a day"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {selectedOrders.length}{" "}
                {selectedOrders.length === 1 ? "order" : "orders"} scheduled
              </p>
            </div>
            {selected ? (
              <button
                type="button"
                className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted"
                onClick={() => setSelected(null)}
                aria-label="Clear selection"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>

          <div className="space-y-3">
            {selectedOrders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="interactive-lift block rounded-xl border border-border p-3"
              >
                <Badge
                  variant={order.order_type === "food_delivery" ? "soft" : "olive"}
                  className="mb-2"
                >
                  {formatOrderType(order.order_type)}
                </Badge>
                <p className="font-medium">
                  {order.notes || order.theme || order.customer_name}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {order.customer_name}
                  {order.address ? ` · ${order.address}` : ""}
                </p>
                {order.event_time ? (
                  <p className="mt-2 text-xs font-medium text-olive">{order.event_time}</p>
                ) : null}
              </Link>
            ))}
            {selected && selectedOrders.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No orders on this day.
              </p>
            ) : null}
          </div>

          <Button className="mt-5 w-full" variant="outline" render={<Link href="/orders/new" />}>
            <Plus className="size-4" />
            Add Order
          </Button>
        </aside>
      </div>
    </div>
  )
}
