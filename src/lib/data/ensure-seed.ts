import "server-only"
import {
  seedCategories,
  seedCustomers,
  seedMenuItems,
  seedOrders,
} from "@/lib/data/seed"
import { createAdminClient } from "@/lib/supabase/admin"

const globalForSeed = globalThis as unknown as {
  __platterHubSeedPromise?: Promise<boolean>
}

/**
 * If Supabase is configured with the service role and has no orders yet,
 * push the real seed dataset once so production matches the app seed.
 */
export async function ensureSupabaseSeeded(): Promise<boolean> {
  if (!globalForSeed.__platterHubSeedPromise) {
    globalForSeed.__platterHubSeedPromise = runEnsure().catch((err) => {
      globalForSeed.__platterHubSeedPromise = undefined
      throw err
    })
  }
  return globalForSeed.__platterHubSeedPromise
}

async function runEnsure(): Promise<boolean> {
  const db = createAdminClient()
  if (!db) return false

  const { count, error } = await db
    .from("orders")
    .select("id", { count: "exact", head: true })
  if (error) throw error
  if ((count ?? 0) > 0) return true

  const { error: catError } = await db.from("menu_categories").upsert(
    seedCategories.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      sort_order: c.sort_order,
    }))
  )
  if (catError) throw catError

  const { error: menuError } = await db.from("menu_items").upsert(
    seedMenuItems.map((m) => ({
      id: m.id,
      category_id: m.category_id,
      name: m.name,
      description: m.description,
      price_small: m.price_small,
      price_medium: m.price_medium,
      price_large: m.price_large,
      unit_label: m.unit_label,
      is_active: m.is_active,
      sort_order: m.sort_order,
    }))
  )
  if (menuError) throw menuError

  const { error: custError } = await db.from("customers").upsert(
    seedCustomers.map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      address: c.address,
      created_at: c.created_at,
      updated_at: c.updated_at,
    }))
  )
  if (custError) throw custError

  const { error: orderError } = await db.from("orders").upsert(
    seedOrders.map((o) => ({
      id: o.id,
      order_number: o.order_number,
      order_type: o.order_type,
      customer_id: o.customer_id,
      customer_name: o.customer_name,
      phone: o.phone,
      address: o.address,
      event_date: o.event_date,
      event_time: o.event_time,
      recipient: o.recipient,
      special_requests: o.special_requests,
      guest_count: o.guest_count,
      theme: o.theme,
      table_organisation: o.table_organisation,
      table_style: o.table_style,
      table_count: o.table_count,
      seating_notes: o.seating_notes,
      styling_fee: o.styling_fee,
      delivery_fee: o.delivery_fee,
      product_fee: o.product_fee,
      total_price: o.total_price,
      amount_paid: o.amount_paid,
      payment_status: o.payment_status,
      status: o.status,
      notes: o.notes,
      created_at: o.created_at,
      updated_at: o.updated_at,
    }))
  )
  if (orderError) throw orderError

  const lineItems = seedOrders.flatMap((o) =>
    (o.line_items ?? []).map((li) => ({
      id: li.id,
      order_id: li.order_id,
      menu_item_id: li.menu_item_id,
      name: li.name,
      description: li.description,
      variant: li.variant,
      quantity: li.quantity,
      unit_price: li.unit_price,
      total_price: li.total_price,
    }))
  )
  if (lineItems.length > 0) {
    const { error: lineError } = await db.from("order_line_items").upsert(lineItems)
    if (lineError) throw lineError
  }

  return true
}
