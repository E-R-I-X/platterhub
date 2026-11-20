import Link from "next/link"
import { Plus, Search, Users } from "lucide-react"
import { SectionHero } from "@/components/layout/section-hero"
import { Pagination } from "@/components/shared/pagination"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getCustomerStats } from "@/lib/data/store"
import { customerInitials, formatDate, pluralize } from "@/lib/format"

export const instant = false

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const q = typeof params.q === "string" ? params.q.toLowerCase() : ""
  const page = Math.max(1, Number(params.page || 1) || 1)
  let customers = await getCustomerStats()

  if (q) {
    customers = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q)
    )
  }

  customers = customers.sort((a, b) => {
    if (!a.last_order_date) return 1
    if (!b.last_order_date) return -1
    return b.last_order_date.localeCompare(a.last_order_date)
  })

  const pageSize = 7
  const pageCount = Math.max(1, Math.ceil(customers.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageItems = customers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return (
    <div className="stagger-children">
      <SectionHero
        eyebrow="Relationships"
        title="Customers"
        description="Everyone who books deliveries or catering events with your kitchen."
        actions={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <form className="relative min-w-[220px] flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/55" />
              <Input
                name="q"
                defaultValue={q}
                placeholder="Search customers..."
                className="border-white/20 bg-white/10 pl-9 text-white placeholder:text-white/50"
              />
            </form>
            <Button variant="hero">
              <Plus className="size-4" />
              Add Customer
            </Button>
          </div>
        }
      />

      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="size-4 text-olive" />
        {pluralize(customers.length, "customer")} · sorted by last order
      </div>

      <div className="surface-card overflow-hidden">
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-canvas/80 text-left text-xs tracking-wide text-muted-foreground uppercase">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">Number of Orders</th>
                <th className="px-5 py-3 font-medium">Last Order Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pageItems.map((customer) => (
                <tr
                  key={customer.id}
                  className="transition-colors duration-200 hover:bg-olive-soft/35"
                >
                  <td className="px-5 py-4">
                    <Link
                      href={`/orders?q=${encodeURIComponent(customer.name)}`}
                      className="flex items-center gap-3"
                    >
                      <span className="flex size-9 items-center justify-center rounded-full bg-olive-soft text-xs font-semibold text-olive ring-2 ring-olive/10">
                        {customerInitials(customer.name)}
                      </span>
                      <span className="font-medium">{customer.name}</span>
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{customer.phone}</td>
                  <td className="px-5 py-4 font-medium">{customer.order_count}</td>
                  <td className="px-5 py-4">
                    {customer.last_order_date
                      ? formatDate(customer.last_order_date, "MMMM d, yyyy")
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-border md:hidden">
          {pageItems.map((customer) => (
            <Link
              key={customer.id}
              href={`/orders?q=${encodeURIComponent(customer.name)}`}
              className="flex items-center gap-3 px-4 py-4 transition-colors duration-200 hover:bg-olive-soft/35"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-olive-soft text-xs font-semibold text-olive">
                {customerInitials(customer.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{customer.name}</p>
                <p className="text-xs text-muted-foreground">{customer.phone}</p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>{pluralize(customer.order_count, "order")}</p>
                <p>
                  {customer.last_order_date
                    ? formatDate(customer.last_order_date)
                    : "—"}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={customers.length}
          pageSize={pageSize}
          basePath="/customers"
          query={{ q: q || undefined }}
        />
      </div>
    </div>
  )
}
