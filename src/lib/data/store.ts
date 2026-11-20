import "server-only"
import { randomUUID } from "crypto"
import { connection } from "next/server"
import {
  seedCategories,
  seedCustomers,
  seedMenuItems,
  seedOrders,
} from "@/lib/data/seed"
import type {
  Customer,
  MenuCategory,
  MenuItem,
  Order,
  OrderFilters,
  OrderInput,
  OrderLineItem,
} from "@/lib/types"

async function ready() {
  await connection()
}

type StoreShape = {
  categories: MenuCategory[]
  menuItems: MenuItem[]
  customers: Customer[]
  orders: Order[]
  nextOrderSeq: number
}

const globalForStore = globalThis as unknown as {
  __platterHubStore?: StoreShape
}

function createStore(): StoreShape {
  return {
    categories: structuredClone(seedCategories),
    menuItems: structuredClone(seedMenuItems),
    customers: structuredClone(seedCustomers),
    orders: structuredClone(seedOrders),
    nextOrderSeq: 1070,
  }
}

function getStore(): StoreShape {
  if (!globalForStore.__platterHubStore) {
    globalForStore.__platterHubStore = createStore()
  }
  return globalForStore.__platterHubStore
}

function withCustomer(order: Order): Order {
  const store = getStore()
  const customer = order.customer_id
    ? store.customers.find((c) => c.id === order.customer_id) ?? null
    : null
  return { ...order, customer, line_items: order.line_items ?? [] }
}

export async function listCategories(): Promise<MenuCategory[]> {
  await ready()
  return getStore().categories.slice().sort((a, b) => a.sort_order - b.sort_order)
}

export async function listMenuItems(): Promise<MenuItem[]> {
  await ready()
  return getStore()
    .menuItems.slice()
    .filter((item) => item.is_active)
    .sort((a, b) => a.sort_order - b.sort_order)
}

export async function listCustomers(): Promise<Customer[]> {
  await ready()
  const store = getStore()
  return store.customers
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
}

export async function getCustomerStats() {
  await ready()
  const store = getStore()
  return store.customers.map((customer) => {
    const orders = store.orders.filter((o) => o.customer_id === customer.id)
    const lastOrder = orders
      .slice()
      .sort((a, b) => b.event_date.localeCompare(a.event_date))[0]
    return {
      ...customer,
      order_count: orders.length,
      last_order_date: lastOrder?.event_date ?? null,
    }
  })
}

export async function listOrders(filters: OrderFilters = {}): Promise<Order[]> {
  await ready()
  const store = getStore()
  let orders = store.orders.map(withCustomer)

  if (filters.type && filters.type !== "all") {
    orders = orders.filter((o) => o.order_type === filters.type)
  }
  if (filters.payment && filters.payment !== "all") {
    orders = orders.filter((o) => o.payment_status === filters.payment)
  }
  if (filters.status && filters.status !== "all") {
    orders = orders.filter((o) => o.status === filters.status)
  }
  if (filters.schedule === "upcoming") {
    const today = new Date().toISOString().slice(0, 10)
    orders = orders.filter(
      (o) => o.event_date >= today && o.status !== "cancelled" && o.status !== "completed"
    )
  }
  if (filters.schedule === "completed") {
    orders = orders.filter((o) => o.status === "completed")
  }
  if (filters.from) {
    orders = orders.filter((o) => o.event_date >= filters.from!)
  }
  if (filters.to) {
    orders = orders.filter((o) => o.event_date <= filters.to!)
  }
  if (filters.customer) {
    const c = filters.customer.toLowerCase()
    orders = orders.filter((o) => o.customer_name.toLowerCase().includes(c))
  }
  if (filters.address) {
    const a = filters.address.toLowerCase()
    orders = orders.filter((o) => o.address.toLowerCase().includes(a))
  }
  if (filters.q) {
    const q = filters.q.toLowerCase()
    orders = orders.filter(
      (o) =>
        o.customer_name.toLowerCase().includes(q) ||
        o.order_number.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q) ||
        o.address.toLowerCase().includes(q) ||
        (o.notes ?? "").toLowerCase().includes(q) ||
        (o.theme ?? "").toLowerCase().includes(q) ||
        (o.recipient ?? "").toLowerCase().includes(q)
    )
  }

  return orders.sort((a, b) => b.event_date.localeCompare(a.event_date))
}

export async function getOrderById(id: string): Promise<Order | null> {
  await ready()
  const order = getStore().orders.find((o) => o.id === id || o.order_number === id)
  return order ? withCustomer(order) : null
}

export async function getUpcomingOrders(limit = 5): Promise<Order[]> {
  await ready()
  const today = new Date().toISOString().slice(0, 10)
  const orders = await listOrders()
  return orders
    .filter((o) => o.event_date >= today && o.status !== "cancelled")
    .sort((a, b) => a.event_date.localeCompare(b.event_date))
    .slice(0, limit)
}

export async function getDashboardStats() {
  await ready()
  const orders = await listOrders()
  const today = new Date()
  const in7 = new Date(today)
  in7.setDate(today.getDate() + 7)
  const todayStr = today.toISOString().slice(0, 10)
  const in7Str = in7.toISOString().slice(0, 10)
  const monthStart = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`

  const upcoming = orders.filter(
    (o) =>
      o.event_date >= todayStr &&
      o.event_date <= in7Str &&
      o.status !== "cancelled"
  )
  const outstanding = orders
    .filter((o) => o.payment_status === "pending" || o.payment_status === "partial")
    .reduce((sum, o) => sum + Math.max(0, o.total_price - o.amount_paid), 0)
  const revenueThisMonth = orders
    .filter((o) => o.event_date >= monthStart && o.payment_status !== "failed")
    .reduce((sum, o) => sum + o.amount_paid, 0)

  return {
    upcomingCount: upcoming.length,
    outstandingBalance: outstanding,
    revenueThisMonth,
    upcomingOrders: upcoming.slice(0, 6),
  }
}

export async function getRevenueTrend(weeks = 6) {
  await ready()
  const orders = await listOrders()
  const today = new Date()
  const points: { label: string; revenue: number; outstanding: number }[] = []

  for (let i = weeks - 1; i >= 0; i--) {
    const end = new Date(today)
    end.setDate(today.getDate() - i * 7)
    const start = new Date(end)
    start.setDate(end.getDate() - 6)
    const startStr = start.toISOString().slice(0, 10)
    const endStr = end.toISOString().slice(0, 10)
    const bucket = orders.filter(
      (o) => o.event_date >= startStr && o.event_date <= endStr
    )
    points.push({
      label: start.toLocaleDateString("en-CA", { month: "short", day: "numeric" }),
      revenue: bucket.reduce((sum, o) => sum + o.amount_paid, 0),
      outstanding: bucket.reduce(
        (sum, o) => sum + Math.max(0, o.total_price - o.amount_paid),
        0
      ),
    })
  }

  return points
}

export async function getFinanceSummary(from?: string, to?: string) {
  await ready()
  let orders = await listOrders()
  if (from) orders = orders.filter((o) => o.event_date >= from)
  if (to) orders = orders.filter((o) => o.event_date <= to)

  const totalRevenue = orders.reduce((sum, o) => sum + o.amount_paid, 0)
  const outstandingBalance = orders.reduce(
    (sum, o) => sum + Math.max(0, o.total_price - o.amount_paid),
    0
  )

  const byType = {
    food_delivery: orders
      .filter((o) => o.order_type === "food_delivery")
      .reduce((sum, o) => sum + o.amount_paid, 0),
    event_catering: orders
      .filter((o) => o.order_type === "event_catering")
      .reduce((sum, o) => sum + o.amount_paid, 0),
  }

  const withBalances = orders
    .filter((o) => o.total_price - o.amount_paid > 0)
    .sort((a, b) => b.event_date.localeCompare(a.event_date))

  return {
    totalRevenue,
    outstandingBalance,
    byType,
    withBalances,
    orders,
  }
}

export async function getOrdersForMonth(year: number, month: number) {
  await ready()
  const prefix = `${year}-${String(month).padStart(2, "0")}`
  const orders = await listOrders()
  return orders.filter((o) => o.event_date.startsWith(prefix))
}

function upsertCustomerFromOrder(input: OrderInput): string {
  const store = getStore()
  const existing = store.customers.find(
    (c) =>
      c.phone.replace(/\s/g, "") === input.phone.replace(/\s/g, "") ||
      c.name.toLowerCase() === input.customer_name.toLowerCase()
  )
  const now = new Date().toISOString()
  if (existing) {
    existing.name = input.customer_name
    existing.phone = input.phone
    existing.address = input.address
    existing.updated_at = now
    return existing.id
  }
  const id = randomUUID()
  store.customers.push({
    id,
    name: input.customer_name,
    phone: input.phone,
    address: input.address,
    created_at: now,
    updated_at: now,
  })
  return id
}

export async function createOrder(input: OrderInput): Promise<Order> {
  await ready()
  const store = getStore()
  const now = new Date().toISOString()
  const id = randomUUID()
  const orderNumber = `ORD-${store.nextOrderSeq++}`
  const customerId = upsertCustomerFromOrder(input)
  const lineItems: OrderLineItem[] = input.line_items.map((item) => ({
    ...item,
    id: randomUUID(),
    order_id: id,
  }))

  const order: Order = {
    ...input,
    id,
    order_number: orderNumber,
    customer_id: customerId,
    created_at: now,
    updated_at: now,
    line_items: lineItems,
  }
  store.orders.unshift(order)
  return withCustomer(order)
}

export async function updateOrder(id: string, input: OrderInput): Promise<Order | null> {
  await ready()
  const store = getStore()
  const index = store.orders.findIndex((o) => o.id === id)
  if (index < 0) return null

  const existing = store.orders[index]
  const customerId = upsertCustomerFromOrder(input)
  const lineItems: OrderLineItem[] = input.line_items.map((item) => ({
    ...item,
    id: randomUUID(),
    order_id: id,
  }))

  const updated: Order = {
    ...existing,
    ...input,
    id: existing.id,
    order_number: existing.order_number,
    customer_id: customerId,
    created_at: existing.created_at,
    updated_at: new Date().toISOString(),
    line_items: lineItems,
  }
  store.orders[index] = updated
  return withCustomer(updated)
}
