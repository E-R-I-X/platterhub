import { Badge } from "@/components/ui/badge"
import { formatOrderType, formatPaymentStatus } from "@/lib/format"
import type { OrderType, PaymentStatus } from "@/lib/types"

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  const variant =
    status === "paid"
      ? "paid"
      : status === "partial"
        ? "partial"
        : status === "failed"
          ? "failed"
          : "pending"

  return (
    <Badge variant={variant}>
      <span
        className={`size-1.5 rounded-full ${
          status === "paid"
            ? "bg-emerald-500"
            : status === "partial"
              ? "bg-orange-500"
              : status === "failed"
                ? "bg-rose-500"
                : "bg-amber-500"
        }`}
      />
      {formatPaymentStatus(status)}
    </Badge>
  )
}

export function OrderTypeBadge({ type }: { type: OrderType }) {
  return (
    <Badge variant={type === "food_delivery" ? "delivery" : "event"}>
      {formatOrderType(type)}
    </Badge>
  )
}
