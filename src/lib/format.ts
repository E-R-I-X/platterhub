import { format, parseISO, isValid } from "date-fns"
import type { OrderType, PaymentStatus, OrderStatus, MenuVariant } from "@/lib/types"

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0)
}

export function formatDate(value: string | Date, pattern = "MMM d, yyyy"): string {
  const date = typeof value === "string" ? parseISO(value) : value
  if (!isValid(date)) return "—"
  return format(date, pattern)
}

export function formatDateLong(value: string | Date): string {
  return formatDate(value, "EEEE, MMMM d, yyyy")
}

export function formatOrderType(type: OrderType): string {
  return type === "food_delivery" ? "Food Delivery" : "Event Catering"
}

export function formatPaymentStatus(status: PaymentStatus): string {
  switch (status) {
    case "paid":
      return "Paid"
    case "partial":
      return "Partial"
    case "failed":
      return "Failed"
    default:
      return "Pending"
  }
}

export function formatOrderStatus(status: OrderStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export function formatVariant(variant: MenuVariant | null | undefined): string {
  if (!variant) return "—"
  return variant.charAt(0).toUpperCase() + variant.slice(1)
}

export function isPreferredDeliveryDay(dateStr: string): boolean {
  const date = parseISO(dateStr)
  if (!isValid(date)) return true
  const day = date.getDay()
  // Thursday (4) through Sunday (0)
  return day === 4 || day === 5 || day === 6 || day === 0
}

export function customerInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export function balanceDue(total: number, paid: number): number {
  return Math.max(0, (total || 0) - (paid || 0))
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`
}
