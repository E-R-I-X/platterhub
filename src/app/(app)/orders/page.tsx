import Link from "next/link"
import { MoreVertical } from "lucide-react"
import { Suspense } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { OrdersFilters } from "@/components/orders/orders-filters"
import { Pagination } from "@/components/shared/pagination"
import { OrderTypeBadge, PaymentBadge } from "@/components/shared/status-badge"
import { listOrders } from "@/lib/data/store"
import { formatDate, formatMoney } from "@/lib/format"
import type {
  OrderStatus,
  OrderType,
  PaymentStatus,
  ScheduleFilter,
} from "@/lib/types"

export const instant = false

const PAGE_SIZE = 6

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const q = typeof params.q === "string" ? params.q : undefined
  const customer = typeof params.customer === "string" ? params.customer : undefined
  const address = typeof params.address === "string" ? params.address : undefined
  const type = (typeof params.type === "string" ? params.type : "all") as
    | OrderType
    | "all"
  const payment = (typeof params.payment === "string" ? params.payment : "all") as
    | PaymentStatus
    | "all"
  const status = (typeof params.status === "string" ? params.status : "all") as
    | OrderStatus
    | "all"
  const schedule = (typeof params.schedule === "string"
    ? params.schedule
    : "all") as ScheduleFilter
  const from = typeof params.from === "string" ? params.from : undefined
  const to = typeof params.to === "string" ? params.to : undefined
  const page = Math.max(1, Number(params.page || 1) || 1)

  const orders = await listOrders({
    q,
    customer,
    address,
    type,
    payment,
    status,
    schedule,
    from,
    to,
  })
  const pageCount = Math.max(1, Math.ceil(orders.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageItems = orders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const query = {
    q,
    customer,
    address,
    type: type === "all" ? undefined : type,
    payment: payment === "all" ? undefined : payment,
    status: status === "all" ? undefined : status,
    schedule: schedule === "all" ? undefined : schedule,
    from,
    to,
  }

  return (
    <div>
      <PageHeader
        title="Orders List"
        description="View and manage all catering orders."
      />

      <Suspense fallback={<div className="mb-5 h-28 animate-pulse rounded-xl bg-muted" />}>
        <OrdersFilters />
      </Suspense>

      <div className="surface-card overflow-hidden">
        <div className="hidden lg:block">
          <table className="w-full text-sm">
            <thead className="bg-canvas/80 text-left text-xs tracking-wide text-muted-foreground uppercase">
              <tr>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Payment</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pageItems.map((order) => (
                <tr key={order.id} className="hover:bg-canvas/60">
                  <td className="px-5 py-4">
                    <Link href={`/orders/${order.id}`} className="block">
                      <p className="font-medium">{formatDate(order.event_date)}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.event_time || formatDate(order.event_date, "EEEE")}
                      </p>
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.notes || order.theme || order.order_number}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <OrderTypeBadge type={order.order_type} />
                  </td>
                  <td className="px-5 py-4 font-medium">{formatMoney(order.total_price)}</td>
                  <td className="px-5 py-4">
                    <PaymentBadge status={order.payment_status} />
                  </td>
                  <td className="px-5 py-4 capitalize text-muted-foreground">{order.status}</td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-flex rounded-lg p-2 text-muted-foreground hover:bg-muted"
                      aria-label="Open order"
                    >
                      <MoreVertical className="size-4" />
                    </Link>
                  </td>
                </tr>
              ))}
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                    No orders match your filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-border lg:hidden">
          {pageItems.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block space-y-3 px-4 py-4 hover:bg-canvas/60"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{order.customer_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(order.event_date)} · {order.order_number}
                  </p>
                </div>
                <p className="font-semibold text-olive">{formatMoney(order.total_price)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <OrderTypeBadge type={order.order_type} />
                <PaymentBadge status={order.payment_status} />
              </div>
            </Link>
          ))}
          {pageItems.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              No orders match your filters.
            </p>
          ) : null}
        </div>

        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={orders.length}
          pageSize={PAGE_SIZE}
          basePath="/orders"
          query={query}
        />
      </div>
    </div>
  )
}
