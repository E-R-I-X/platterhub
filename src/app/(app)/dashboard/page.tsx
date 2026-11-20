import Link from "next/link"
import { ArrowUpRight, CalendarDays, Plus, TrendingUp, Wallet } from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { OrderTypeBadge, PaymentBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { getDashboardStats } from "@/lib/data/store"
import { formatDate, formatMoney } from "@/lib/format"

export const instant = false

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="relative overflow-hidden rounded-[1.75rem] border border-olive/20 text-white shadow-[0_20px_50px_-28px_rgba(28,36,20,0.55)]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 12% 20%, rgba(85,107,47,0.9), transparent 42%), radial-gradient(ellipse at 88% 10%, rgba(216,224,200,0.28), transparent 36%), linear-gradient(135deg, #1c2414 0%, #2f3d1c 55%, #556b2f 140%)",
          }}
        />
        <div className="relative grid gap-6 px-5 py-7 sm:px-7 sm:py-9 lg:grid-cols-[1.4fr_auto] lg:items-end">
          <div>
            <p className="text-hero-eyebrow text-xs tracking-[0.2em] uppercase">
              The Platter Hub
            </p>
            <h1 className="font-display mt-2 max-w-xl text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
              Today&apos;s kitchen overview
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/75 sm:text-base">
              Track deliveries and event catering from one place — upcoming jobs,
              balances due, and revenue at a glance.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              render={<Link href="/orders/new" />}
              className="bg-white text-foreground hover:bg-olive-soft"
            >
              <Plus className="size-4" />
              New Order
            </Button>
            <Button
              variant="outline"
              render={<Link href="/calendar" />}
              className="border-white/25 bg-white/5 text-white hover:bg-white/10"
            >
              Open calendar
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          icon={<CalendarDays className="size-5" />}
          label="Upcoming Orders"
          value={String(stats.upcomingCount)}
          hint="Next 7 days"
          accent
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
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2 className="font-semibold tracking-tight">Upcoming Orders</h2>
            <p className="text-xs text-muted-foreground">Soonest scheduled jobs first</p>
          </div>
          <Link
            href="/orders"
            className="inline-flex items-center gap-1 text-sm font-medium text-olive hover:underline"
          >
            View all
            <ArrowUpRight className="size-3.5" />
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
                <tr key={order.id} className="transition-colors hover:bg-olive-soft/30">
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
              className="block space-y-2 px-5 py-4 transition-colors hover:bg-olive-soft/30"
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
      </section>
    </div>
  )
}
