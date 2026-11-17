import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { Pagination } from "@/components/shared/pagination"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getCustomerStats } from "@/lib/data/store"
import { customerInitials, formatDate } from "@/lib/format"

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
    <div>
      <PageHeader
        title="Customers"
        description="View and manage your customers."
        actions={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <div className="relative min-w-[220px] flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <form>
                <Input
                  name="q"
                  defaultValue={q}
                  placeholder="Search customers..."
                  className="pl-9"
                />
              </form>
            </div>
            <Button>
              <Plus className="size-4" />
              Add Customer
            </Button>
          </div>
        }
      />

      <div className="overflow-hidden rounded-xl border border-border bg-white">
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
                <tr key={customer.id} className="hover:bg-canvas/60">
                  <td className="px-5 py-4">
                    <Link
                      href={`/orders?q=${encodeURIComponent(customer.name)}`}
                      className="flex items-center gap-3"
                    >
                      <span className="flex size-9 items-center justify-center rounded-full bg-olive-soft text-xs font-semibold text-olive">
                        {customerInitials(customer.name)}
                      </span>
                      <span className="font-medium">{customer.name}</span>
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{customer.phone}</td>
                  <td className="px-5 py-4">{customer.order_count}</td>
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
              className="flex items-center gap-3 px-4 py-4"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-olive-soft text-xs font-semibold text-olive">
                {customerInitials(customer.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{customer.name}</p>
                <p className="text-xs text-muted-foreground">{customer.phone}</p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>{customer.order_count} orders</p>
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
      <p className="mt-3 text-right text-xs text-muted-foreground">
        Sort by Last Order Date ↓
      </p>
    </div>
  )
}
