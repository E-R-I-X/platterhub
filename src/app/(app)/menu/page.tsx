import Link from "next/link"
import { Apple, Cookie, Drumstick, Plus, Search, Soup, Sparkles } from "lucide-react"
import { SectionHero } from "@/components/layout/section-hero"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { listCategories, listMenuItems } from "@/lib/data/store"
import { formatMoney } from "@/lib/format"

export const instant = false

const categoryIcons: Record<string, React.ReactNode> = {
  "cat-rice": <Soup className="size-5" />,
  "cat-proteins": <Drumstick className="size-5" />,
  "cat-finger": <Sparkles className="size-5" />,
  "cat-desserts": <Cookie className="size-5" />,
  "cat-fruits": <Apple className="size-5" />,
}

export default async function MenuPage() {
  const [categories, items] = await Promise.all([listCategories(), listMenuItems()])

  return (
    <div className="stagger-children">
      <SectionHero
        eyebrow="The Platter Hub · Event Menu"
        title="The Savoury Edit"
        description="Rice, proteins, finger foods, desserts, and fresh fruit — sized for trays and gatherings."
        actions={
          <div className="relative min-w-[220px]">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/55" />
            <Input
              placeholder="Search menu items..."
              className="border-white/20 bg-white/10 pl-9 text-white placeholder:text-white/50"
            />
          </div>
        }
      />

      <div className="space-y-10">
        {categories.map((category) => {
          const categoryItems = items.filter((item) => item.category_id === category.id)
          return (
            <section key={category.id}>
              <div className="mb-4 flex items-end justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-olive-soft text-olive">
                    {categoryIcons[category.id] ?? <Sparkles className="size-5" />}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold tracking-tight">
                      {category.name}
                    </h3>
                    {category.description ? (
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {categoryItems.map((item) => (
                  <article
                    key={item.id}
                    className="interactive-lift flex flex-col rounded-[1.35rem] border border-border/80 bg-card p-5"
                  >
                    <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-olive-soft text-olive">
                      {categoryIcons[category.id] ?? <Sparkles className="size-4" />}
                    </div>
                    <h4 className="text-base font-semibold">{item.name}</h4>
                    {item.description ? (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    ) : null}
                    {item.unit_label ? (
                      <p className="mt-2 text-xs font-medium text-olive">{item.unit_label}</p>
                    ) : null}

                    <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                      {item.price_small != null ? (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Small</span>
                          <span className="font-semibold">{formatMoney(item.price_small)}</span>
                        </div>
                      ) : null}
                      {item.price_medium != null ? (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Medium</span>
                          <span className="font-semibold">{formatMoney(item.price_medium)}</span>
                        </div>
                      ) : null}
                      {item.price_large != null ? (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Large</span>
                          <span className="font-semibold">{formatMoney(item.price_large)}</span>
                        </div>
                      ) : null}
                    </div>

                    <Button
                      className="mt-5 w-full"
                      size="sm"
                      render={<Link href="/orders/new" />}
                    >
                      <Plus className="size-4" />
                      Add Item
                    </Button>
                  </article>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      <p className="mt-8 rounded-2xl border border-dashed border-olive-muted bg-olive-soft/50 px-5 py-4 text-sm text-olive">
        <strong>Minimums:</strong> 10 pieces per finger food or dessert; 10 fruit cups or
        skewers. Puff-puff: 50 pieces. Styling & set-up fees are quoted per event.
      </p>
    </div>
  )
}
