import { connection } from "next/server"
import { MonthCalendar } from "@/components/calendar/month-calendar"
import { listOrders } from "@/lib/data/store"

export const instant = false

export default async function CalendarPage() {
  await connection()
  const orders = await listOrders()
  const today = new Date().toISOString().slice(0, 10)
  return <MonthCalendar orders={orders} today={today} />
}
