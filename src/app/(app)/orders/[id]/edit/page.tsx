import { notFound } from "next/navigation"
import { OrderForm } from "@/components/orders/order-form"
import { getOrderById, listMenuItems } from "@/lib/data/store"

export const instant = false

export default async function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [order, menuItems] = await Promise.all([getOrderById(id), listMenuItems()])
  if (!order) notFound()
  return <OrderForm menuItems={menuItems} order={order} />
}
