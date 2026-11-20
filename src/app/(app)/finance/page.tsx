import Link from "next/link"
import { Suspense } from "react"
import { Clock3, Receipt, Wallet } from "lucide-react"
import { SectionHero } from "@/components/layout/section-hero"
import { FinanceFilters } from "@/components/finance/finance-filters"
import {
  FinanceInfoButton,
  FinanceReportButton,
} from "@/components/finance/finance-info"
import { RevenueChart } from "@/components/finance/revenue-chart"
import { Pagination } from "@/components/shared/pagination"
import { PaymentBadge, OrderTypeBadge } from "@/components/shared/status-badge"
import { getFinanceSummary, getRevenueTrend } from "@/lib/data/store"
import { balanceDue, formatDate, formatMoney } from "@/lib/format"

export const instant = false

export default async function FinancePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const q = typeof params.q === "string" ? params.q.toLowerCase() : ""
  const from = typeof params.from === "string" ? params.from : undefined
  const to = typeof params.to === "string" ? params.to : undefined
  const page = Math.max(1, Number(params.page || 1) || 1)
  const [summary, trend] = await Promise.all([
    getFinanceSummary(from, to),
    getRevenueTrend(6),
  ])

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
    <div className="stagger-children">
      <SectionHero
        eyebrow="Revenue"
        title="Finance"
        description="Overview of revenue, balances and order payments."
        actions={
          <Suspense fallback={<div className="h-10 w-28 animate-pulse rounded-lg bg-muted" />}>
            <FinanceFilters />
          </Suspense>
        }
      />

      <div className="mb-6">
        <RevenueChart points={trend} />
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="surface-card interactive-lift p-5 sm:p-6">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-olive-soft text-olive">
            <Wallet className="size-5" />
          </div>
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="mt-1 text-3xl font-bold text-olive">
            {formatMoney(summary.totalRevenue)}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Sum of amount paid in the selected date range.
          </p>
        </div>
        <Link
          href="/orders?payment=partial"
          className="surface-card interactive-lift p-5 sm:p-6"
        >
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-olive-soft text-olive">
            <Clock3 className="size-5" />
          </div>
          <p className="text-sm text-muted-foreground">Outstanding Balance</p>
          <p className="mt-1 text-3xl font-bold text-olive">
            {formatMoney(summary.outstandingBalance)}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Total of total price minus amount paid.
          </p>
        </Link>
        <div className="surface-card interactive-lift p-5 sm:p-6">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-olive-soft text-olive">
            <Receipt className="size-5" />
          </div>
          <p className="text-sm text-muted-foreground">Orders with balance due</p>
          <p className="mt-1 text-3xl font-bold text-olive">
            {summary.withBalances.length}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Orders where outstanding is greater than zero.
          </p>
        </div>
      </div>

      <section className="surface-card mb-6 p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-semibold">
            Revenue Breakdown by Order Type
            <FinanceInfoButton />
          </h2>
          <FinanceReportButton
            totalRevenue={summary.totalRevenue}
            outstanding={summary.outstandingBalance}
            delivery={summary.byType.food_delivery}
            catering={summary.byType.event_catering}
            dueCount={summary.withBalances.length}
          />
        </div>

        <div className="space-y-4">
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium">Event Catering</span>
              <span>
                {formatMoney(summary.byType.event_catering)} ({eventShare.toFixed(1)}%)
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
                {formatMoney(summary.byType.food_delivery)} ({deliveryShare.toFixed(1)}%)
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-olive" style={{ width: `${deliveryShare}%` }} />
            </div>
          </div>
        </div>
      </section>

      <section className="surface-card overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold">Orders with Balances Due</h2>
        </div>

        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-canvas/80 text-left text-xs tracking-wide text-muted-foreground uppercase">
              <tr>
                <th className="px-5 py-3 font-medium">Order date</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Order type</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Amount paid</th>
                <th className="px-5 py-3 font-medium">Balance due</th>
                <th className="px-5 py-3 font-medium">Payment status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pageItems.map((order) => {
                const due = balanceDue(order.total_price, order.amount_paid)
                return (
                  <tr key={order.id} className="hover:bg-muted/40">
                    <td className="px-5 py-4">
                      <Link
                        href={`/orders/${order.id}`}
                        className="font-medium text-olive underline-offset-2 hover:underline"
                      >
                        {formatDate(order.event_date)}
                      </Link>
                      <p className="text-xs text-muted-foreground">{order.order_number}</p>
                    </td>
                    <td className="px-5 py-4">{order.customer_name}</td>
                    <td className="px-5 py-4">
                      <OrderTypeBadge type={order.order_type} />
                    </td>
                    <td className="px-5 py-4">{formatMoney(order.total_price)}</td>
                    <td className="px-5 py-4">{formatMoney(order.amount_paid)}</td>
                    <td className="px-5 py-4 font-semibold text-olive">
                      {formatMoney(due)}
                    </td>
                    <td className="px-5 py-4">
                      <PaymentBadge status={order.payment_status} />
                    </td>
                  </tr>
                )
              })}
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
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
                    <p className="font-semibold">{order.customer_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(order.event_date)} · {order.order_number}
                    </p>
                  </div>
                  <p className="font-semibold text-olive">{formatMoney(due)}</p>
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
          query={{ q: q || undefined, from, to }}
        />
      </section>
    </div>
  )
}
