import { Search } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { listCategories, listMenuItems } from "@/lib/data/store"
import { formatNaira } from "@/lib/format"

export const instant = false

export default async function MenuPage() {
  const [categories, items] = await Promise.all([listCategories(), listMenuItems()])

  return (
    <div>
      <PageHeader
        title="Menu"
        description="Browse and select catering items by category."
        actions={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <div className="relative min-w-[240px] flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search menu items..." className="pl-9" />
            </div>
            <Button variant="outline">Filters</Button>
          </div>
        }
      />

      <div className="mb-6 overflow-hidden rounded-xl border border-border bg-white">
        <div className="bg-foreground px-5 py-3 text-sm tracking-[0.12em] text-white uppercase">
          <span className="font-semibold">The Platter Hub</span>
          <span className="float-right text-olive-muted">Event Menu</span>
        </div>
        <div className="px-5 py-6">
          <h2 className="font-display text-3xl font-semibold tracking-tight uppercase">
            The Savoury Edit
          </h2>
          <p className="mt-1 text-xs tracking-[0.16em] text-muted-foreground uppercase">
            Rice / Pasta / Proteins / Finger Foods / Desserts / Fresh Fruits
          </p>
          <div className="mt-3 h-1.5 w-24 bg-olive" />
        </div>
      </div>

      <div className="space-y-8">
        {categories.map((category, index) => {
          const categoryItems = items.filter((item) => item.category_id === category.id)
          return (
            <section key={category.id} className="overflow-hidden rounded-xl border border-border bg-white">
              <div
                className={
                  index === 0
                    ? "flex items-center gap-3 bg-foreground px-5 py-3 text-white"
                    : "flex items-center gap-3 border-b border-border px-5 py-3"
                }
              >
                <span className="font-display text-xl font-semibold text-olive">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3
                    className={`text-sm font-semibold tracking-[0.14em] uppercase ${
                      index === 0 ? "text-white" : "text-foreground"
                    }`}
                  >
                    {category.name}
                  </h3>
                  {category.description ? (
                    <p
                      className={`text-xs ${
                        index === 0 ? "text-white/70" : "text-muted-foreground"
                      }`}
                    >
                      {category.description}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="hidden md:block">
                <div className="grid grid-cols-[1fr_repeat(3,7rem)] gap-3 border-b border-border px-5 py-2 text-xs tracking-wide text-muted-foreground uppercase">
                  <span>Item</span>
                  <span className="text-right">Small</span>
                  <span className="text-right">Medium</span>
                  <span className="text-right">Large</span>
                </div>
                <div className="divide-y divide-border">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[1fr_repeat(3,7rem)] gap-3 px-5 py-3 text-sm"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.description ? (
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        ) : null}
                        {item.unit_label ? (
                          <p className="text-xs text-olive">{item.unit_label}</p>
                        ) : null}
                      </div>
                      <p className="text-right">
                        {item.price_small != null ? formatNaira(item.price_small) : "—"}
                      </p>
                      <p className="text-right">
                        {item.price_medium != null ? formatNaira(item.price_medium) : "—"}
                      </p>
                      <p className="text-right">
                        {item.price_large != null ? formatNaira(item.price_large) : "—"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 p-4 md:hidden">
                {categoryItems.map((item) => (
                  <div key={item.id} className="rounded-lg border border-border p-4">
                    <p className="font-semibold">{item.name}</p>
                    {item.description ? (
                      <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                    ) : null}
                    <div className="mt-3 space-y-1 text-sm">
                      {item.price_small != null ? (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Small</span>
                          <span className="font-medium">{formatNaira(item.price_small)}</span>
                        </div>
                      ) : null}
                      {item.price_medium != null ? (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Medium</span>
                          <span className="font-medium">{formatNaira(item.price_medium)}</span>
                        </div>
                      ) : null}
                      {item.price_large != null ? (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Large</span>
                          <span className="font-medium">{formatNaira(item.price_large)}</span>
                        </div>
                      ) : null}
                    </div>
                    <Button className="mt-4 w-full" size="sm" render={<a href="/orders/new" />}>
                      + Add Item
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      <p className="mt-6 rounded-xl border border-border bg-white px-5 py-4 text-sm text-muted-foreground">
        <strong className="text-foreground">Minimums:</strong> 10 pieces per finger food or
        dessert; 10 fruit cups or skewers. Puff-puff: 50 pieces. Additional pieces may be
        ordered individually. Styling & set-up fees quoted per event.
      </p>
    </div>
  )
}
