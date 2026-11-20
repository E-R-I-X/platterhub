"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { requireUser } from "@/lib/auth"
import { createOrder, updateOrder } from "@/lib/data/store"
import type { MenuVariant, OrderInput, OrderType, PaymentStatus, OrderStatus } from "@/lib/types"

function num(value: FormDataEntryValue | null): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

function parseLineItems(formData: FormData) {
  const raw = String(formData.get("line_items_json") || "[]")
  const parsed = JSON.parse(raw) as Array<{
    menu_item_id?: string | null
    name: string
    description?: string | null
    variant?: MenuVariant | null
    quantity: number
    unit_price: number
  }>

  return parsed.map((item) => {
    const quantity = Math.max(1, Number(item.quantity) || 1)
    const unitPrice = Math.max(0, Number(item.unit_price) || 0)
    const isCustom = !item.menu_item_id
    return {
      menu_item_id: isCustom ? null : item.menu_item_id ?? null,
      name: String(item.name || "").trim() || (isCustom ? "Custom item" : "Item"),
      description: item.description ?? null,
      variant: isCustom ? null : item.variant ?? null,
      quantity,
      unit_price: unitPrice,
      total_price: quantity * unitPrice,
    }
  })
}

function formToInput(formData: FormData): OrderInput {
  const orderType = String(formData.get("order_type")) as OrderType
  const lineItems = parseLineItems(formData)
  const productFee = lineItems.reduce((sum, item) => sum + item.total_price, 0)
  const deliveryFee = orderType === "food_delivery" ? num(formData.get("delivery_fee")) : 0
  const stylingFee = orderType === "event_catering" ? num(formData.get("styling_fee")) : 0
  const totalPrice = productFee + deliveryFee + stylingFee
  const amountPaid = num(formData.get("amount_paid"))
  const paymentStatus = String(formData.get("payment_status") || "pending") as PaymentStatus

  return {
    order_type: orderType,
    customer_id: null,
    customer_name: String(formData.get("customer_name") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    address: String(formData.get("address") || "").trim(),
    event_date: String(formData.get("event_date") || ""),
    event_time: String(formData.get("event_time") || "") || null,
    recipient: String(formData.get("recipient") || "") || null,
    special_requests: String(formData.get("special_requests") || "") || null,
    guest_count: formData.get("guest_count") ? num(formData.get("guest_count")) : null,
    theme: String(formData.get("theme") || "") || null,
    table_organisation: formData.get("table_organisation") === "yes",
    table_style: String(formData.get("table_style") || "") || null,
    table_count: String(formData.get("table_count") || "") || null,
    seating_notes: String(formData.get("seating_notes") || "") || null,
    styling_fee: stylingFee,
    delivery_fee: deliveryFee,
    product_fee: productFee,
    total_price: totalPrice,
    amount_paid: amountPaid,
    payment_status: paymentStatus,
    status: (String(formData.get("status") || "pending") as OrderStatus) || "pending",
    notes: String(formData.get("notes") || "") || null,
    line_items: lineItems,
  }
}

export type OrderFormState = { error?: string }

export async function createOrderAction(
  _prev: OrderFormState,
  formData: FormData
): Promise<OrderFormState> {
  await requireUser()
  try {
    const input = formToInput(formData)
    if (!input.customer_name || !input.phone || !input.address || !input.event_date) {
      return { error: "Please fill in all required fields." }
    }
    const order = await createOrder(input)
    revalidatePath("/")
    redirect(`/orders/${order.id}`)
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error
    return { error: "Could not save order. Please try again." }
  }
}

export async function updateOrderAction(
  orderId: string,
  _prev: OrderFormState,
  formData: FormData
): Promise<OrderFormState> {
  await requireUser()
  try {
    const input = formToInput(formData)
    if (!input.customer_name || !input.phone || !input.address || !input.event_date) {
      return { error: "Please fill in all required fields." }
    }
    const order = await updateOrder(orderId, input)
    if (!order) return { error: "Order not found." }
    revalidatePath("/")
    redirect(`/orders/${order.id}`)
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error
    return { error: "Could not update order. Please try again." }
  }
}
