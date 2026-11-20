import { notFound } from "next/navigation"
import { OrderForm } from "@/components/orders/order-form"
import { getOrderById, listCategories, listMenuItems } from "@/lib/data/store"

export const instant = false

export default async function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [order, menuItems, categories] = await Promise.all([
    getOrderById(id),
    listMenuItems(),
    listCategories(),
  ])
  if (!order) notFound()
  return (
    <OrderForm menuItems={menuItems} categories={categories} order={order} />
  )
}
