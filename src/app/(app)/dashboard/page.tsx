import Link from "next/link"
import { CalendarDays, TrendingUp, Wallet } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { OrderTypeBadge, PaymentBadge } from "@/components/shared/status-badge"
import { getDashboardStats } from "@/lib/data/store"
import { formatDate, formatMoney } from "@/lib/format"

export const instant = false

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening with your catering business today."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          icon={<CalendarDays className="size-5" />}
          label="Upcoming Orders"
          value={String(stats.upcomingCount)}
          hint="Next 7 days"
        />
        <StatCard
          icon={<Wallet className="size-5" />}
          label="Outstanding Balance"
          value={formatMoney(stats.outstandingBalance)}
          trend={{ label: "Balances due across open orders", positive: false }}
        />
        <StatCard
          icon={<TrendingUp className="size-5" />}
          label="Revenue This Month"
          value={formatMoney(stats.revenueThisMonth)}
          trend={{ label: "From paid & partial payments", positive: true }}
        />
      </div>

      <section className="surface-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-semibold text-foreground">Upcoming Orders</h2>
          <Link href="/orders" className="text-sm font-medium text-olive hover:underline">
            View all orders →
          </Link>
        </div>

        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-canvas/80 text-left text-xs tracking-wide text-muted-foreground uppercase">
              <tr>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {stats.upcomingOrders.map((order) => (
                <tr key={order.id} className="hover:bg-canvas/60">
                  <td className="px-5 py-4">
                    <Link href={`/orders/${order.id}`} className="block">
                      <p className="font-medium">{formatDate(order.event_date)}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(order.event_date, "EEEE")}
                      </p>
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.notes || order.theme || order.recipient || "—"}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <OrderTypeBadge type={order.order_type} />
                  </td>
                  <td className="px-5 py-4 font-medium">{formatMoney(order.total_price)}</td>
                  <td className="px-5 py-4">
                    <PaymentBadge status={order.payment_status} />
                  </td>
                </tr>
              ))}
              {stats.upcomingOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                    No upcoming orders in the next 7 days.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-border md:hidden">
          {stats.upcomingOrders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block space-y-2 px-5 py-4 hover:bg-canvas/60"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{order.customer_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(order.event_date)} · {order.notes || order.theme || "Order"}
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
        </div>

        <div className="border-t border-border px-5 py-3 text-center">
          <Link href="/orders" className="text-sm font-medium text-olive hover:underline">
            View all upcoming orders →
          </Link>
        </div>
      </section>
    </div>
  )
}
