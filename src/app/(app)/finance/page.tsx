import Link from "next/link"
import { BarChart3, Clock3, Info, Search, Wallet } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { Pagination } from "@/components/shared/pagination"
import { PaymentBadge, OrderTypeBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getFinanceSummary } from "@/lib/data/store"
import { balanceDue, formatDate, formatNaira } from "@/lib/format"

export const instant = false

export default async function FinancePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const q = typeof params.q === "string" ? params.q.toLowerCase() : ""
  const page = Math.max(1, Number(params.page || 1) || 1)
  const summary = await getFinanceSummary()

  let balances = summary.withBalances
  if (q) {
    balances = balances.filter(
      (o) =>
        o.customer_name.toLowerCase().includes(q) ||
        o.order_number.toLowerCase().includes(q)
    )
  }

  const pageSize = 5
  const pageCount = Math.max(1, Math.ceil(balances.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageItems = balances.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const deliveryShare =
    summary.totalRevenue > 0
      ? (summary.byType.food_delivery / summary.totalRevenue) * 100
      : 0
  const eventShare =
    summary.totalRevenue > 0
      ? (summary.byType.event_catering / summary.totalRevenue) * 100
      : 0

  return (
    <div>
      <PageHeader
        title="Finance / Revenue"
        description="Overview of revenue, balances and order payments."
      />

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-olive-soft text-olive">
            <Wallet className="size-5" />
          </div>
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="mt-1 text-3xl font-bold text-olive">
            {formatNaira(summary.totalRevenue)}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Total revenue from all paid and partially paid orders.
          </p>
        </div>
        <Link
          href="/orders?payment=partial"
          className="rounded-xl border border-border bg-white p-5 transition-colors hover:bg-canvas/50"
        >
          <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-olive-soft text-olive">
            <Clock3 className="size-5" />
          </div>
          <p className="text-sm text-muted-foreground">Outstanding Balance</p>
          <p className="mt-1 text-3xl font-bold text-olive">
            {formatNaira(summary.outstandingBalance)}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Total balance due across all orders.
          </p>
        </Link>
      </div>

      <section className="mb-6 rounded-xl border border-border bg-white p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-semibold">
            Revenue Breakdown by Order Type
            <Info className="size-4 text-muted-foreground" />
          </h2>
          <Button variant="outline" size="sm">
            <BarChart3 className="size-4" />
            View Full Report
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium">Event Catering</span>
              <span>
                {formatNaira(summary.byType.event_catering)} ({eventShare.toFixed(1)}%)
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-olive" style={{ width: `${eventShare}%` }} />
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium">Food Delivery</span>
              <span>
                {formatNaira(summary.byType.food_delivery)} ({deliveryShare.toFixed(1)}%)
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-olive" style={{ width: `${deliveryShare}%` }} />
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-semibold">Orders with Balances Due</h2>
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <form>
              <Input
                name="q"
                defaultValue={q}
                placeholder="Search orders..."
                className="pl-9"
              />
            </form>
          </div>
        </div>

        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-canvas/80 text-left text-xs tracking-wide text-muted-foreground uppercase">
              <tr>
                <th className="px-5 py-3 font-medium">Order #</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Order Type</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Paid</th>
                <th className="px-5 py-3 font-medium">Balance Due</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pageItems.map((order) => {
                const due = balanceDue(order.total_price, order.amount_paid)
                return (
                  <tr key={order.id} className="hover:bg-canvas/60">
                    <td className="px-5 py-4">
                      <Link
                        href={`/orders/${order.id}`}
                        className="font-medium text-olive underline-offset-2 hover:underline"
                      >
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-5 py-4">{formatDate(order.event_date)}</td>
                    <td className="px-5 py-4">{order.customer_name}</td>
                    <td className="px-5 py-4">
                      <OrderTypeBadge type={order.order_type} />
                    </td>
                    <td className="px-5 py-4">{formatNaira(order.total_price)}</td>
                    <td className="px-5 py-4">{formatNaira(order.amount_paid)}</td>
                    <td className="px-5 py-4 font-semibold text-olive">
                      {formatNaira(due)}
                    </td>
                    <td className="px-5 py-4">
                      <PaymentBadge status={order.payment_status} />
                    </td>
                  </tr>
                )
              })}
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-muted-foreground">
                    No outstanding balances.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-border md:hidden">
          {pageItems.map((order) => {
            const due = balanceDue(order.total_price, order.amount_paid)
            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block space-y-2 px-4 py-4"
              >
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="font-semibold text-olive">{order.order_number}</p>
                    <p className="text-sm">{order.customer_name}</p>
                  </div>
                  <p className="font-semibold">{formatNaira(due)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <OrderTypeBadge type={order.order_type} />
                  <PaymentBadge status={order.payment_status} />
                </div>
              </Link>
            )
          })}
        </div>

        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={balances.length}
          pageSize={pageSize}
          basePath="/finance"
          query={{ q: q || undefined }}
        />
      </section>
    </div>
  )
}
