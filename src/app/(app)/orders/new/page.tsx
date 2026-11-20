import { OrderForm } from "@/components/orders/order-form"
import { listCategories, listMenuItems } from "@/lib/data/store"

export const instant = false

export default async function NewOrderPage() {
  const [menuItems, categories] = await Promise.all([
    listMenuItems(),
    listCategories(),
  ])
  return <OrderForm menuItems={menuItems} categories={categories} />
}
