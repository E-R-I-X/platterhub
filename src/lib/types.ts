export type OrderType = "food_delivery" | "event_catering"
export type PaymentStatus = "pending" | "partial" | "paid" | "failed"
export type OrderStatus = "pending" | "confirmed" | "completed" | "cancelled"
export type MenuVariant = "small" | "medium" | "large"

export interface MenuCategory {
  id: string
  name: string
  description: string | null
  sort_order: number
}

export interface MenuItem {
  id: string
  category_id: string
  name: string
  description: string | null
  price_small: number | null
  price_medium: number | null
  price_large: number | null
  unit_label: string | null
  is_active: boolean
  sort_order: number
}

export interface Customer {
  id: string
  name: string
  phone: string
  address: string | null
  created_at: string
  updated_at: string
}

export interface OrderLineItem {
  id: string
  order_id: string
  menu_item_id: string | null
  name: string
  description: string | null
  variant: MenuVariant | null
  quantity: number
  unit_price: number
  total_price: number
}

export interface Order {
  id: string
  order_number: string
  order_type: OrderType
  customer_id: string | null
  customer_name: string
  phone: string
  address: string
  event_date: string
  event_time: string | null
  recipient: string | null
  special_requests: string | null
  guest_count: number | null
  theme: string | null
  table_organisation: boolean
  table_style: string | null
  table_count: string | null
  seating_notes: string | null
  styling_fee: number
  delivery_fee: number
  product_fee: number
  total_price: number
  amount_paid: number
  payment_status: PaymentStatus
  status: OrderStatus
  notes: string | null
  created_at: string
  updated_at: string
  customer?: Customer | null
  line_items?: OrderLineItem[]
}

export type ScheduleFilter = "all" | "upcoming" | "completed"

export interface OrderFilters {
  q?: string
  customer?: string
  address?: string
  type?: OrderType | "all"
  payment?: PaymentStatus | "all"
  status?: OrderStatus | "all"
  schedule?: ScheduleFilter
  from?: string
  to?: string
}

export type OrderInput = Omit<
  Order,
  "id" | "order_number" | "created_at" | "updated_at" | "customer" | "line_items"
> & {
  line_items: Omit<OrderLineItem, "id" | "order_id">[]
}
