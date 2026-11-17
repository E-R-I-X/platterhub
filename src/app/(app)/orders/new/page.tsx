import { OrderForm } from "@/components/orders/order-form"
import { listMenuItems } from "@/lib/data/store"

export const instant = false

export default async function NewOrderPage() {
  const menuItems = await listMenuItems()
  return <OrderForm menuItems={menuItems} />
}
