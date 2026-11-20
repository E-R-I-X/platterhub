import "server-only"
import { randomUUID } from "crypto"
import { createAdminClient } from "@/lib/supabase/admin"
import type {
  Customer,
  MenuCategory,
  MenuItem,
  Order,
  OrderFilters,
  OrderInput,
  OrderLineItem,
} from "@/lib/types"

function n(value: unknown): number {
  if (value == null) return 0
  return typeof value === "number" ? value : Number(value)
}

function nNull(value: unknown): number | null {
  if (value == null) return null
  return typeof value === "number" ? value : Number(value)
}

function mapCategory(row: Record<string, unknown>): MenuCategory {
  return {
    id: String(row.id),
    name: String(row.name),
    description: (row.description as string | null) ?? null,
    sort_order: n(row.sort_order),
  }
}

function mapMenuItem(row: Record<string, unknown>): MenuItem {
  return {
    id: String(row.id),
    category_id: String(row.category_id),
    name: String(row.name),
    description: (row.description as string | null) ?? null,
    price_small: nNull(row.price_small),
    price_medium: nNull(row.price_medium),
    price_large: nNull(row.price_large),
    unit_label: (row.unit_label as string | null) ?? null,
    is_active: Boolean(row.is_active),
    sort_order: n(row.sort_order),
  }
}

function mapCustomer(row: Record<string, unknown>): Customer {
  return {
    id: String(row.id),
    name: String(row.name),
    phone: String(row.phone),
    address: (row.address as string | null) ?? null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  }
}

function mapLineItem(row: Record<string, unknown>): OrderLineItem {
  return {
    id: String(row.id),
    order_id: String(row.order_id),
    menu_item_id: row.menu_item_id ? String(row.menu_item_id) : null,
    name: String(row.name),
    description: (row.description as string | null) ?? null,
    variant: (row.variant as OrderLineItem["variant"]) ?? null,
    quantity: n(row.quantity),
    unit_price: n(row.unit_price),
    total_price: n(row.total_price),
  }
}

function mapOrder(
  row: Record<string, unknown>,
  lineItems: OrderLineItem[] = [],
  customer: Customer | null = null
): Order {
  return {
    id: String(row.id),
    order_number: String(row.order_number),
    order_type: row.order_type as Order["order_type"],
    customer_id: row.customer_id ? String(row.customer_id) : null,
    customer_name: String(row.customer_name),
    phone: String(row.phone),
    address: String(row.address),
    event_date: String(row.event_date),
    event_time: (row.event_time as string | null) ?? null,
    recipient: (row.recipient as string | null) ?? null,
    special_requests: (row.special_requests as string | null) ?? null,
    guest_count: row.guest_count == null ? null : n(row.guest_count),
    theme: (row.theme as string | null) ?? null,
    table_organisation: Boolean(row.table_organisation),
    table_style: (row.table_style as string | null) ?? null,
    table_count: (row.table_count as string | null) ?? null,
    seating_notes: (row.seating_notes as string | null) ?? null,
    styling_fee: n(row.styling_fee),
    delivery_fee: n(row.delivery_fee),
    product_fee: n(row.product_fee),
    total_price: n(row.total_price),
    amount_paid: n(row.amount_paid),
    payment_status: row.payment_status as Order["payment_status"],
    status: row.status as Order["status"],
    notes: (row.notes as string | null) ?? null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    customer,
    line_items: lineItems,
  }
}

function client() {
  const db = createAdminClient()
  if (!db) throw new Error("Supabase admin client is not configured")
  return db
}

export async function dbListCategories(): Promise<MenuCategory[]> {
  const { data, error } = await client()
    .from("menu_categories")
    .select("*")
    .order("sort_order")
  if (error) throw error
  return (data ?? []).map((row) => mapCategory(row as Record<string, unknown>))
}

export async function dbListMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await client()
    .from("menu_items")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")
  if (error) throw error
  return (data ?? []).map((row) => mapMenuItem(row as Record<string, unknown>))
}

export async function dbListCustomers(): Promise<Customer[]> {
  const { data, error } = await client().from("customers").select("*").order("name")
  if (error) throw error
  return (data ?? []).map((row) => mapCustomer(row as Record<string, unknown>))
}

async function loadLineItems(orderIds: string[]): Promise<Map<string, OrderLineItem[]>> {
  const map = new Map<string, OrderLineItem[]>()
  if (orderIds.length === 0) return map

  const { data, error } = await client()
    .from("order_line_items")
    .select("*")
    .in("order_id", orderIds)
  if (error) throw error

  for (const row of data ?? []) {
    const item = mapLineItem(row as Record<string, unknown>)
    const list = map.get(item.order_id) ?? []
    list.push(item)
    map.set(item.order_id, list)
  }
  return map
}

async function loadCustomersById(ids: string[]): Promise<Map<string, Customer>> {
  const map = new Map<string, Customer>()
  const unique = [...new Set(ids.filter(Boolean))]
  if (unique.length === 0) return map

  const { data, error } = await client().from("customers").select("*").in("id", unique)
  if (error) throw error
  for (const row of data ?? []) {
    const c = mapCustomer(row as Record<string, unknown>)
    map.set(c.id, c)
  }
  return map
}

function applyFilters(orders: Order[], filters: OrderFilters): Order[] {
  let result = orders

  if (filters.type && filters.type !== "all") {
    result = result.filter((o) => o.order_type === filters.type)
  }
  if (filters.payment && filters.payment !== "all") {
    result = result.filter((o) => o.payment_status === filters.payment)
  }
  if (filters.status && filters.status !== "all") {
    result = result.filter((o) => o.status === filters.status)
  }
  if (filters.schedule === "upcoming") {
    const today = new Date().toISOString().slice(0, 10)
    result = result.filter(
      (o) => o.event_date >= today && o.status !== "cancelled" && o.status !== "completed"
    )
  }
  if (filters.schedule === "completed") {
    result = result.filter((o) => o.status === "completed")
  }
  if (filters.from) {
    result = result.filter((o) => o.event_date >= filters.from!)
  }
  if (filters.to) {
    result = result.filter((o) => o.event_date <= filters.to!)
  }
  if (filters.customer) {
    const c = filters.customer.toLowerCase()
    result = result.filter((o) => o.customer_name.toLowerCase().includes(c))
  }
  if (filters.address) {
    const a = filters.address.toLowerCase()
    result = result.filter((o) => o.address.toLowerCase().includes(a))
  }
  if (filters.q) {
    const q = filters.q.toLowerCase()
    result = result.filter(
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

  return result.sort((a, b) => b.event_date.localeCompare(a.event_date))
}

export async function dbListOrders(filters: OrderFilters = {}): Promise<Order[]> {
  const { data, error } = await client()
    .from("orders")
    .select("*")
    .order("event_date", { ascending: false })
  if (error) throw error

  const rows = (data ?? []) as Record<string, unknown>[]
  const lineMap = await loadLineItems(rows.map((r) => String(r.id)))
  const custMap = await loadCustomersById(
    rows.map((r) => (r.customer_id ? String(r.customer_id) : "")).filter(Boolean)
  )

  const orders = rows.map((row) => {
    const id = String(row.id)
    const customerId = row.customer_id ? String(row.customer_id) : null
    return mapOrder(
      row,
      lineMap.get(id) ?? [],
      customerId ? custMap.get(customerId) ?? null : null
    )
  })

  return applyFilters(orders, filters)
}

export async function dbGetOrderById(id: string): Promise<Order | null> {
  const db = client()
  let { data, error } = await db.from("orders").select("*").eq("id", id).maybeSingle()
  if (error) throw error
  if (!data) {
    const byNumber = await db.from("orders").select("*").eq("order_number", id).maybeSingle()
    if (byNumber.error) throw byNumber.error
    data = byNumber.data
  }
  if (!data) return null

  const row = data as Record<string, unknown>
  const lineMap = await loadLineItems([String(row.id)])
  const custMap = await loadCustomersById(
    row.customer_id ? [String(row.customer_id)] : []
  )
  const customerId = row.customer_id ? String(row.customer_id) : null

  return mapOrder(
    row,
    lineMap.get(String(row.id)) ?? [],
    customerId ? custMap.get(customerId) ?? null : null
  )
}

async function upsertCustomer(input: OrderInput): Promise<string> {
  const db = client()
  const phoneKey = input.phone.replace(/\s/g, "")
  const { data: existing, error: findError } = await db.from("customers").select("*")
  if (findError) throw findError

  const match = (existing ?? []).find(
    (c) =>
      String(c.phone).replace(/\s/g, "") === phoneKey ||
      String(c.name).toLowerCase() === input.customer_name.toLowerCase()
  )

  const now = new Date().toISOString()
  if (match) {
    const { error } = await db
      .from("customers")
      .update({
        name: input.customer_name,
        phone: input.phone,
        address: input.address,
        updated_at: now,
      })
      .eq("id", match.id)
    if (error) throw error
    return String(match.id)
  }

  const id = randomUUID()
  const { error } = await db.from("customers").insert({
    id,
    name: input.customer_name,
    phone: input.phone,
    address: input.address,
    created_at: now,
    updated_at: now,
  })
  if (error) throw error
  return id
}

async function nextOrderNumber(): Promise<string> {
  const { data, error } = await client()
    .from("orders")
    .select("order_number")
    .order("created_at", { ascending: false })
    .limit(50)
  if (error) throw error

  let max = 2050
  for (const row of data ?? []) {
    const match = String(row.order_number).match(/ORD-(\d+)/i)
    if (match) max = Math.max(max, Number(match[1]))
  }
  return `ORD-${max + 1}`
}

export async function dbCreateOrder(input: OrderInput): Promise<Order> {
  const db = client()
  const now = new Date().toISOString()
  const id = randomUUID()
  const orderNumber = await nextOrderNumber()
  const customerId = await upsertCustomer(input)

  const { error: orderError } = await db.from("orders").insert({
    id,
    order_number: orderNumber,
    order_type: input.order_type,
    customer_id: customerId,
    customer_name: input.customer_name,
    phone: input.phone,
    address: input.address,
    event_date: input.event_date,
    event_time: input.event_time,
    recipient: input.recipient,
    special_requests: input.special_requests,
    guest_count: input.guest_count,
    theme: input.theme,
    table_organisation: input.table_organisation,
    table_style: input.table_style,
    table_count: input.table_count,
    seating_notes: input.seating_notes,
    styling_fee: input.styling_fee,
    delivery_fee: input.delivery_fee,
    product_fee: input.product_fee,
    total_price: input.total_price,
    amount_paid: input.amount_paid,
    payment_status: input.payment_status,
    status: input.status,
    notes: input.notes,
    created_at: now,
    updated_at: now,
  })
  if (orderError) throw orderError

  if (input.line_items.length > 0) {
    const { error: lineError } = await db.from("order_line_items").insert(
      input.line_items.map((item) => ({
        id: randomUUID(),
        order_id: id,
        menu_item_id: item.menu_item_id,
        name: item.name,
        description: item.description,
        variant: item.variant,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
      }))
    )
    if (lineError) throw lineError
  }

  const created = await dbGetOrderById(id)
  if (!created) throw new Error("Failed to load created order")
  return created
}

export async function dbUpdateOrder(id: string, input: OrderInput): Promise<Order | null> {
  const db = client()
  const existing = await dbGetOrderById(id)
  if (!existing) return null

  const customerId = await upsertCustomer(input)
  const now = new Date().toISOString()

  const { error: orderError } = await db
    .from("orders")
    .update({
      order_type: input.order_type,
      customer_id: customerId,
      customer_name: input.customer_name,
      phone: input.phone,
      address: input.address,
      event_date: input.event_date,
      event_time: input.event_time,
      recipient: input.recipient,
      special_requests: input.special_requests,
      guest_count: input.guest_count,
      theme: input.theme,
      table_organisation: input.table_organisation,
      table_style: input.table_style,
      table_count: input.table_count,
      seating_notes: input.seating_notes,
      styling_fee: input.styling_fee,
      delivery_fee: input.delivery_fee,
      product_fee: input.product_fee,
      total_price: input.total_price,
      amount_paid: input.amount_paid,
      payment_status: input.payment_status,
      status: input.status,
      notes: input.notes,
      updated_at: now,
    })
    .eq("id", existing.id)
  if (orderError) throw orderError

  const { error: deleteError } = await db
    .from("order_line_items")
    .delete()
    .eq("order_id", existing.id)
  if (deleteError) throw deleteError

  if (input.line_items.length > 0) {
    const { error: lineError } = await db.from("order_line_items").insert(
      input.line_items.map((item) => ({
        id: randomUUID(),
        order_id: existing.id,
        menu_item_id: item.menu_item_id,
        name: item.name,
        description: item.description,
        variant: item.variant,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
      }))
    )
    if (lineError) throw lineError
  }

  return dbGetOrderById(existing.id)
}

export async function dbHasSeedData(): Promise<boolean> {
  const { count, error } = await client()
    .from("orders")
    .select("id", { count: "exact", head: true })
  if (error) throw error
  return (count ?? 0) > 0
}
