"use client"

import { useActionState, useMemo, useState } from "react"
import Link from "next/link"
import { Info, Plus, Trash2, Check } from "lucide-react"
import {
  createOrderAction,
  updateOrderAction,
  type OrderFormState,
} from "@/app/actions/orders"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { formatMoney, isPreferredDeliveryDay } from "@/lib/format"
import type { MenuItem, MenuVariant, Order, OrderType, PaymentStatus } from "@/lib/types"

const CUSTOM_ITEM = "__custom__"

type DraftItem = {
  key: string
  menu_item_id: string | null
  name: string
  description: string | null
  variant: MenuVariant | null
  quantity: number
  unit_price: number
  is_custom: boolean
}

const initialState: OrderFormState = {}

function priceFor(item: MenuItem, variant: MenuVariant | null): number {
  if (variant === "medium") return item.price_medium ?? 0
  if (variant === "large") return item.price_large ?? 0
  return item.price_small ?? 0
}

function availableVariants(item: MenuItem): MenuVariant[] {
  const variants: MenuVariant[] = []
  if (item.price_small != null) variants.push("small")
  if (item.price_medium != null) variants.push("medium")
  if (item.price_large != null) variants.push("large")
  return variants
}

function toDraft(
  item: {
    id: string
    menu_item_id: string | null
    name: string
    description: string | null
    variant: MenuVariant | null
    quantity: number
    unit_price: number
  },
  index: number
): DraftItem {
  return {
    key: `${item.id}-${index}`,
    menu_item_id: item.menu_item_id,
    name: item.name,
    description: item.description,
    variant: item.variant,
    quantity: item.quantity,
    unit_price: item.unit_price,
    is_custom: !item.menu_item_id,
  }
}

export function OrderForm({
  menuItems,
  order,
}: {
  menuItems: MenuItem[]
  order?: Order
}) {
  const isEdit = Boolean(order)
  const action = isEdit
    ? updateOrderAction.bind(null, order!.id)
    : createOrderAction

  const [state, formAction, pending] = useActionState(action, initialState)
  const [orderType, setOrderType] = useState<OrderType>(
    order?.order_type ?? "food_delivery"
  )
  const [eventDate, setEventDate] = useState(order?.event_date ?? "")
  const [deliveryFee, setDeliveryFee] = useState(order?.delivery_fee ?? 0)
  const [stylingFee, setStylingFee] = useState(order?.styling_fee ?? 0)
  const [tableOrg, setTableOrg] = useState(order?.table_organisation ?? false)
  const [items, setItems] = useState<DraftItem[]>(
    (order?.line_items ?? []).map((item, index) => toDraft(item, index))
  )

  const productFee = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0),
    [items]
  )
  const total =
    productFee +
    (orderType === "food_delivery" ? deliveryFee : 0) +
    (orderType === "event_catering" ? stylingFee : 0)

  const showDateWarning = eventDate && !isPreferredDeliveryDay(eventDate)

  const lineItemsJson = useMemo(
    () =>
      JSON.stringify(
        items.map(({ menu_item_id, name, description, variant, quantity, unit_price, is_custom }) => ({
          menu_item_id: is_custom ? null : menu_item_id,
          name: name.trim() || (is_custom ? "Custom item" : "Item"),
          description,
          variant: is_custom ? null : variant,
          quantity,
          unit_price,
        }))
      ),
    [items]
  )

  function addMenuItem() {
    const first = menuItems[0]
    if (!first) {
      addCustomItem()
      return
    }
    const variants = availableVariants(first)
    const variant = variants[0] ?? null
    setItems((prev) => [
      ...prev,
      {
        key: crypto.randomUUID(),
        menu_item_id: first.id,
        name: first.name,
        description: first.description,
        variant,
        quantity: 1,
        unit_price: priceFor(first, variant),
        is_custom: false,
      },
    ])
  }

  function addCustomItem() {
    setItems((prev) => [
      ...prev,
      {
        key: crypto.randomUUID(),
        menu_item_id: null,
        name: "",
        description: null,
        variant: null,
        quantity: 1,
        unit_price: 0,
        is_custom: true,
      },
    ])
  }

  function updateItem(key: string, patch: Partial<DraftItem>) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.key !== key) return item
        const next = { ...item, ...patch }

        if (patch.menu_item_id === CUSTOM_ITEM || patch.is_custom === true) {
          next.is_custom = true
          next.menu_item_id = null
          next.variant = null
          if (!item.is_custom) {
            next.name = ""
            next.description = null
            next.unit_price = 0
          }
          return next
        }

        if (patch.menu_item_id && patch.menu_item_id !== CUSTOM_ITEM) {
          const menuItem = menuItems.find((m) => m.id === patch.menu_item_id)
          if (menuItem) {
            const variants = availableVariants(menuItem)
            const variant =
              patch.variant && variants.includes(patch.variant)
                ? patch.variant
                : variants[0] ?? null
            next.is_custom = false
            next.menu_item_id = menuItem.id
            next.name = menuItem.name
            next.description = menuItem.description
            next.variant = variant
            next.unit_price = priceFor(menuItem, variant)
          }
        } else if (patch.variant && !item.is_custom) {
          const menuItem = menuItems.find((m) => m.id === item.menu_item_id)
          if (menuItem) next.unit_price = priceFor(menuItem, patch.variant)
        }
        return next
      })
    )
  }

  function removeItem(key: string) {
    setItems((prev) => prev.filter((item) => item.key !== key))
  }

  return (
    <form action={formAction} className="mx-auto max-w-3xl space-y-6">
      <input type="hidden" name="order_type" value={orderType} />
      <input type="hidden" name="line_items_json" value={lineItemsJson} />
      <input
        type="hidden"
        name="table_organisation"
        value={tableOrg ? "yes" : "no"}
      />

      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          {isEdit
            ? `Edit ${order?.order_number}`
            : orderType === "food_delivery"
              ? "New Food Delivery Order"
              : "New Event Catering Order"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {orderType === "food_delivery"
            ? "Create a new delivery order with customer and order details."
            : "Create a new event catering order with guest and styling details."}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["food_delivery", "event_catering"] as OrderType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setOrderType(type)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              orderType === type
                ? "bg-olive text-white"
                : "border border-border bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            {type === "food_delivery" ? "Food Delivery" : "Event Catering"}
          </button>
        ))}
      </div>

      <div className="surface-card space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="customer_name">
              Customer name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="customer_name"
              name="customer_name"
              required
              defaultValue={order?.customer_name}
              placeholder="Enter customer full name"
            />
          </div>
          <div>
            <Label htmlFor="phone">
              Phone <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              required
              defaultValue={order?.phone}
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <Label htmlFor="event_date">
              {orderType === "food_delivery" ? "Delivery date" : "Event date"}{" "}
              <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="event_date"
              name="event_date"
              type="date"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
            {showDateWarning ? (
              <p className="mt-2 flex items-start gap-2 text-sm text-olive">
                <Info className="mt-0.5 size-4 shrink-0" />
                Please note: Deliveries on Thu–Sat may have longer wait times. This date
                is not Thursday, Friday, or Saturday.
              </p>
            ) : eventDate ? (
              <p className="mt-2 flex items-start gap-2 text-sm text-olive">
                <Info className="mt-0.5 size-4 shrink-0" />
                Preferred delivery window: Thursday–Saturday.
              </p>
            ) : null}
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="address">
              Address <span className="text-rose-500">*</span>
            </Label>
            <Textarea
              id="address"
              name="address"
              required
              defaultValue={order?.address}
              placeholder="Enter full delivery / event address"
            />
          </div>
        </div>

        {orderType === "food_delivery" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="recipient">
                Recipient <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="recipient"
                name="recipient"
                required
                defaultValue={order?.recipient ?? ""}
                placeholder="Enter recipient name (if different)"
              />
            </div>
            <div>
              <Label htmlFor="event_time">Delivery time</Label>
              <Input
                id="event_time"
                name="event_time"
                defaultValue={order?.event_time ?? ""}
                placeholder="e.g. 11:00 AM - 12:00 PM"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="special_requests">Special requests / customisation</Label>
              <Textarea
                id="special_requests"
                name="special_requests"
                defaultValue={order?.special_requests ?? ""}
                placeholder="Add any special instructions, allergies, customisations, balloons, or delivery notes..."
              />
            </div>
            <div>
              <Label htmlFor="delivery_fee">Delivery fee (CAD)</Label>
              <Input
                id="delivery_fee"
                name="delivery_fee"
                type="number"
                min="0"
                step="0.01"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(Number(e.target.value) || 0)}
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="event_time">
                Event time <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="event_time"
                name="event_time"
                required
                defaultValue={order?.event_time ?? ""}
                placeholder="e.g. 12:00 PM – 4:00 PM"
              />
            </div>
            <div>
              <Label htmlFor="guest_count">
                Number of guests <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="guest_count"
                name="guest_count"
                type="number"
                min="1"
                required
                defaultValue={order?.guest_count ?? ""}
              />
            </div>
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Input
                id="theme"
                name="theme"
                defaultValue={order?.theme ?? ""}
                placeholder="e.g. Rustic Garden"
              />
            </div>
            <div>
              <Label htmlFor="styling_fee">Styling & set-up fee (CAD)</Label>
              <Input
                id="styling_fee"
                name="styling_fee"
                type="number"
                min="0"
                step="0.01"
                value={stylingFee}
                onChange={(e) => setStylingFee(Number(e.target.value) || 0)}
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Table organisation</Label>
              <div className="mt-1 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setTableOrg(false)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    !tableOrg
                      ? "bg-olive text-white"
                      : "border border-border bg-card text-muted-foreground"
                  }`}
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={() => setTableOrg(true)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    tableOrg
                      ? "bg-olive text-white"
                      : "border border-border bg-card text-muted-foreground"
                  }`}
                >
                  Yes
                </button>
              </div>
            </div>
            {tableOrg ? (
              <>
                <div>
                  <Label htmlFor="table_style">Table style</Label>
                  <Input
                    id="table_style"
                    name="table_style"
                    defaultValue={order?.table_style ?? ""}
                    placeholder="Round Tables"
                  />
                </div>
                <div>
                  <Label htmlFor="table_count">Tables</Label>
                  <Input
                    id="table_count"
                    name="table_count"
                    defaultValue={order?.table_count ?? ""}
                    placeholder="10 tables (7–8 guests)"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="seating_notes">Seating notes</Label>
                  <Input
                    id="seating_notes"
                    name="seating_notes"
                    defaultValue={order?.seating_notes ?? ""}
                  />
                </div>
              </>
            ) : null}
            <div className="sm:col-span-2">
              <Label htmlFor="notes">Notes / conditions</Label>
              <Textarea
                id="notes"
                name="notes"
                defaultValue={order?.notes ?? ""}
                placeholder="Conditions, allergies, service notes..."
              />
            </div>
          </div>
        )}
      </div>

      <div className="surface-card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">Line items</h2>
            <p className="text-sm text-muted-foreground">
              Add menu items or custom items with their own price.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={addMenuItem}>
              <Plus className="size-4" />
              From menu
            </Button>
            <Button type="button" variant="outline" onClick={addCustomItem}>
              <Plus className="size-4" />
              Custom item
            </Button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-olive-muted bg-olive-soft/40 px-4 py-10 text-center text-sm text-olive-dark">
            No items added yet. Add from the menu or create a custom item with a price.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const menuItem = !item.is_custom
                ? menuItems.find((m) => m.id === item.menu_item_id)
                : undefined
              const variants = menuItem ? availableVariants(menuItem) : []
              return (
                <div
                  key={item.key}
                  className="space-y-3 rounded-xl border border-border p-3 sm:p-4"
                >
                  <div className="grid gap-3 md:grid-cols-[1.5fr_0.9fr_0.6fr_0.7fr_auto]">
                    <div>
                      <Label>Item source</Label>
                      <Select
                        value={item.is_custom ? CUSTOM_ITEM : item.menu_item_id ?? ""}
                        onChange={(e) => {
                          const value = e.target.value
                          if (value === CUSTOM_ITEM) {
                            updateItem(item.key, { is_custom: true, menu_item_id: CUSTOM_ITEM })
                          } else {
                            updateItem(item.key, {
                              is_custom: false,
                              menu_item_id: value,
                            })
                          }
                        }}
                      >
                        <option value={CUSTOM_ITEM}>Custom item…</option>
                        {menuItems.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </Select>
                    </div>

                    {item.is_custom ? (
                      <div>
                        <Label>Unit price (CAD)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unit_price}
                          onChange={(e) =>
                            updateItem(item.key, {
                              unit_price: Math.max(0, Number(e.target.value) || 0),
                            })
                          }
                        />
                      </div>
                    ) : (
                      <div>
                        <Label>Size</Label>
                        <Select
                          value={item.variant ?? ""}
                          onChange={(e) =>
                            updateItem(item.key, {
                              variant: (e.target.value || null) as MenuVariant | null,
                            })
                          }
                        >
                          {variants.length === 0 ? (
                            <option value="">—</option>
                          ) : (
                            variants.map((v) => (
                              <option key={v} value={v}>
                                {v.charAt(0).toUpperCase() + v.slice(1)}
                              </option>
                            ))
                          )}
                        </Select>
                      </div>
                    )}

                    <div>
                      <Label>Qty</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(item.key, {
                            quantity: Math.max(1, Number(e.target.value) || 1),
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Line total</Label>
                      <p className="flex h-10 items-center text-sm font-semibold text-olive">
                        {formatMoney(item.quantity * item.unit_price)}
                      </p>
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-rose-50 hover:text-rose-600"
                        aria-label="Remove item"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>

                  {item.is_custom ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <Label>Custom item name</Label>
                        <Input
                          value={item.name}
                          placeholder="e.g. Extra cutlery set"
                          onChange={(e) =>
                            updateItem(item.key, { name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label>Notes (optional)</Label>
                        <Input
                          value={item.description ?? ""}
                          placeholder="Size, flavour, or notes"
                          onChange={(e) =>
                            updateItem(item.key, {
                              description: e.target.value || null,
                            })
                          }
                        />
                      </div>
                    </div>
                  ) : menuItem ? (
                    <p className="text-xs text-muted-foreground">
                      {formatMoney(item.unit_price)} each
                      {menuItem.unit_label ? ` · ${menuItem.unit_label}` : ""}
                      {menuItem.description ? ` · ${menuItem.description}` : ""}
                    </p>
                  ) : null}
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-5 ml-auto w-full max-w-xs space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Product fee</span>
            <span>{formatMoney(productFee)}</span>
          </div>
          {orderType === "food_delivery" ? (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery fee</span>
              <span>{formatMoney(deliveryFee)}</span>
            </div>
          ) : (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Styling fee</span>
              <span>{formatMoney(stylingFee)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span className="text-olive">{formatMoney(total)}</span>
          </div>
        </div>
      </div>

      <div className="surface-card p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="payment_status">
              Payment status <span className="text-rose-500">*</span>
            </Label>
            <Select
              id="payment_status"
              name="payment_status"
              defaultValue={(order?.payment_status as PaymentStatus) || "pending"}
              required
            >
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="amount_paid">Amount paid (CAD)</Label>
            <Input
              id="amount_paid"
              name="amount_paid"
              type="number"
              min="0"
              step="0.01"
              defaultValue={order?.amount_paid ?? 0}
            />
          </div>
          <div>
            <Label htmlFor="status">Order status</Label>
            <Select id="status" name="status" defaultValue={order?.status || "pending"}>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </div>
        </div>

        {orderType === "food_delivery" ? (
          <input type="hidden" name="notes" value={order?.notes ?? ""} />
        ) : null}

        {state.error ? (
          <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {state.error}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" render={<Link href="/orders" />}>
            Cancel
          </Button>
          <Button type="submit" disabled={pending}>
            <Check className="size-4" />
            {pending ? "Saving…" : "Save Order"}
          </Button>
        </div>
      </div>
    </form>
  )
}
