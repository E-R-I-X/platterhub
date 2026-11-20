import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Leaf,
  ListChecks,
  MessageSquareText,
  Pencil,
  Printer,
  Tag,
  Users,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { OrderTypeBadge, PaymentBadge } from "@/components/shared/status-badge"
import { getOrderById } from "@/lib/data/store"
import {
  balanceDue,
  formatDateLong,
  formatMoney,
  formatOrderType,
  formatVariant,
} from "@/lib/format"

export const instant = false

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await getOrderById(id)
  if (!order) notFound()

  const due = balanceDue(order.total_price, order.amount_paid)

  return (
    <div className="stagger-children mx-auto max-w-5xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-olive transition-opacity hover:opacity-80 hover:underline"
        >
          <ArrowLeft className="size-4" />
          Orders / #{order.order_number}
        </Link>
        <Button variant="outline" size="sm">
          <Printer className="size-4" />
          Print
        </Button>
      </div>

      <div className="surface-card overflow-hidden">
        <div
          className="border-b border-olive/15 px-5 py-5 text-white md:px-6"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #1c2414 0%, #2f3d1c 55%, #556b2f 140%)",
          }}
        >
          <p className="text-xs tracking-[0.18em] text-olive-muted uppercase">Order detail</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
              {order.notes || order.theme || order.customer_name}
            </h1>
            <OrderTypeBadge type={order.order_type} />
          </div>
        </div>
        <div className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between md:p-6">
          <div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4 text-olive" />
                {formatDateLong(order.event_date)}
              </span>
              {order.event_time ? (
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="size-4 text-olive" />
                  {order.event_time}
                </span>
              ) : null}
              {order.guest_count ? (
                <span className="inline-flex items-center gap-1.5">
                  <Users className="size-4 text-olive" />
                  {order.guest_count} Guests
                </span>
              ) : null}
              {order.theme ? (
                <span className="inline-flex items-center gap-1.5">
                  <Leaf className="size-4 text-olive" />
                  Theme: {order.theme}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1.5">
                <Wallet className="size-4 text-olive" />
                Payment: {order.payment_status}
              </span>
            </div>
          </div>
          <Button render={<Link href={`/orders/${order.id}/edit`} />}>
            <Pencil className="size-4" />
            Edit Order
          </Button>
        </div>
      </div>

      {order.order_type === "event_catering" && order.table_organisation ? (
        <section className="surface-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold">
              <ListChecks className="size-4 text-olive" />
              Table Organisation
            </h2>
            <span className="text-sm text-olive">View seating chart ›</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Table Style</p>
              <p className="mt-1 font-medium">{order.table_style || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tables</p>
              <p className="mt-1 font-medium">{order.table_count || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Seating Notes</p>
              <p className="mt-1 font-medium">{order.seating_notes || "—"}</p>
            </div>
          </div>
        </section>
      ) : null}

      {order.order_type === "event_catering" ? (
        <section className="surface-card p-5">
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <Leaf className="size-4 text-olive" />
            Styling & Service
          </h2>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium">Styling Fee</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Includes table linens, place settings, centerpieces, and serviceware.
              </p>
            </div>
            <p className="font-semibold">{formatMoney(order.styling_fee)}</p>
          </div>
          <div className="mt-4 rounded-lg bg-olive-soft px-3 py-2 text-sm text-olive-dark">
            Eco-friendly disposables and linens included
          </div>
        </section>
      ) : null}

      {order.order_type === "food_delivery" ? (
        <section className="surface-card p-5">
          <h2 className="mb-4 font-semibold">Delivery Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Recipient</p>
              <p className="mt-1 font-medium">{order.recipient || order.customer_name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Address</p>
              <p className="mt-1 font-medium">{order.address}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-muted-foreground">Special requests</p>
              <p className="mt-1 font-medium">{order.special_requests || "—"}</p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="surface-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-semibold">
            <ListChecks className="size-4 text-olive" />
            Order Items
          </h2>
          <Link href="/menu" className="text-sm font-medium text-olive hover:underline">
            View full menu
          </Link>
        </div>

        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="text-left text-xs tracking-wide text-muted-foreground uppercase">
              <tr>
                <th className="pb-3 font-medium">Item</th>
                <th className="pb-3 font-medium">Qty</th>
                <th className="pb-3 font-medium">Unit Price</th>
                <th className="pb-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(order.line_items ?? []).map((item) => (
                <tr key={item.id}>
                  <td className="py-3">
                    <div className="flex items-start gap-2">
                      <Leaf className="mt-0.5 size-4 text-olive" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {[formatVariant(item.variant), item.description]
                            .filter(Boolean)
                            .join(" · ") || "—"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">{item.quantity}</td>
                  <td className="py-3">{formatMoney(item.unit_price)}</td>
                  <td className="py-3 text-right font-medium">
                    {formatMoney(item.total_price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 md:hidden">
          {(order.line_items ?? []).map((item) => (
            <div key={item.id} className="rounded-lg border border-border p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatVariant(item.variant)} · Qty {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">{formatMoney(item.total_price)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end border-t border-border pt-4 text-sm">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Product fee</span>
              <span>{formatMoney(order.product_fee)}</span>
            </div>
            {order.delivery_fee > 0 ? (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery fee</span>
                <span>{formatMoney(order.delivery_fee)}</span>
              </div>
            ) : null}
            {order.styling_fee > 0 ? (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Styling fee</span>
                <span>{formatMoney(order.styling_fee)}</span>
              </div>
            ) : null}
            <div className="flex justify-between font-semibold">
              <span>Subtotal</span>
              <span>{formatMoney(order.total_price)}</span>
            </div>
          </div>
        </div>
      </section>

      {order.notes || order.special_requests ? (
        <section className="surface-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold">
              <MessageSquareText className="size-4 text-olive" />
              Notes
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-foreground">
            {order.notes || order.special_requests}
          </p>
        </section>
      ) : null}

      <section className="overflow-hidden surface-card">
        <div className="grid md:grid-cols-2">
          <div className="bg-olive-soft p-6">
            <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-white text-olive">
              <Tag className="size-5" />
            </div>
            <p className="text-sm text-olive-dark">Total Price</p>
            <p className="mt-1 text-3xl font-bold text-olive">
              {formatMoney(order.total_price)}
            </p>
            <p className="mt-2 text-xs text-olive-dark/80">
              {formatOrderType(order.order_type)} · {order.order_number}
            </p>
          </div>
          <div className="flex flex-col justify-center p-6">
            <p className="text-sm text-muted-foreground">Balance Due</p>
            <p className="mt-1 text-3xl font-bold text-foreground">{formatMoney(due)}</p>
            <div className="mt-3">
              <PaymentBadge status={order.payment_status} />
            </div>
            {order.payment_status === "paid" ? (
              <Badge variant="paid" className="mt-3 w-fit">
                Paid
              </Badge>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  )
}
