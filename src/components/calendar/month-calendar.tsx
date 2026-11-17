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
    <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
      <div className="rounded-xl border border-border bg-white p-4 md:p-5">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <h1 className="mr-auto text-2xl font-bold tracking-tight">Calendar</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCursor(startOfMonth(todayDate))
              setSelected(todayDate)
            }}
          >
            Today
          </Button>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="rounded-lg border border-border p-2 hover:bg-muted"
              onClick={() => setCursor((d) => subMonths(d, 1))}
              aria-label="Previous month"
            >
              <ChevronLeft className="size-4" />
            </button>
            <p className="min-w-32 text-center text-sm font-semibold">
              {format(cursor, "MMMM yyyy")}
            </p>
            <button
              type="button"
              className="rounded-lg border border-border p-2 hover:bg-muted"
              onClick={() => setCursor((d) => addMonths(d, 1))}
              aria-label="Next month"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-border bg-border">
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
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelected(day)}
                className={`min-h-24 bg-white p-2 text-left transition-colors hover:bg-olive-soft/50 ${
                  !inMonth ? "bg-canvas/70 text-muted-foreground" : ""
                } ${isSelected ? "bg-olive-soft ring-2 ring-olive ring-inset" : ""}`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">{format(day, "d")}</span>
                  {dayOrders.length > 0 ? (
                    <span className="size-1.5 rounded-full bg-olive" />
                  ) : null}
                </div>
                <div className="space-y-1">
                  {dayOrders.slice(0, 2).map((order) => (
                    <p
                      key={order.id}
                      className="truncate rounded bg-olive-soft px-1.5 py-0.5 text-[10px] font-medium text-olive-dark"
                    >
                      {order.order_type === "food_delivery" ? "Delivery" : "Catering Event"}
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
          Scheduled Event
        </div>
      </div>

      <aside className="rounded-xl border border-border bg-white p-5">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="font-semibold">
              {selected ? format(selected, "MMMM d, yyyy") : "Select a day"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {selectedOrders.length}{" "}
              {selectedOrders.length === 1 ? "Order" : "Orders"} Scheduled
            </p>
          </div>
          {selected ? (
            <button
              type="button"
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
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
              className="block rounded-xl border border-border p-3 hover:bg-canvas/70"
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
  )
}

