"use client"

import { useMemo, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Overlay, OverlayHeader } from "@/components/ui/overlay"
import { cn } from "@/lib/utils"

export function FinanceFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const applied = useMemo(
    () => ({
      from: searchParams.get("from") ?? "",
      to: searchParams.get("to") ?? "",
      q: searchParams.get("q") ?? "",
    }),
    [searchParams]
  )
  const [draft, setDraft] = useState(applied)
  const activeCount = [applied.from, applied.to, applied.q].filter(Boolean).length

  function apply() {
    const params = new URLSearchParams()
    if (draft.from) params.set("from", draft.from)
    if (draft.to) params.set("to", draft.to)
    if (draft.q) params.set("q", draft.q)
    startTransition(() => {
      router.push(params.toString() ? `${pathname}?${params}` : pathname)
      setOpen(false)
    })
  }

  function clearAll() {
    setDraft({ from: "", to: "", q: "" })
    startTransition(() => {
      router.push(pathname)
      setOpen(false)
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setDraft(applied)
          setOpen(true)
        }}
        className={cn(
          "relative inline-flex h-10 items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-3 text-sm font-medium text-white transition-colors hover:bg-white/15",
          activeCount > 0 && "border-olive-muted"
        )}
      >
        <Filter className="size-4" />
        Date range
        {activeCount > 0 ? (
          <span className="flex size-5 items-center justify-center rounded-full bg-olive text-[11px] font-bold text-white">
            {activeCount}
          </span>
        ) : null}
      </button>

      <Overlay open={open} onClose={() => setOpen(false)} placement="center">
        <OverlayHeader
          title="Finance filters"
          description="Narrow revenue by date range or search"
          onClose={() => setOpen(false)}
        />
        <div className="space-y-4 px-5 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="fin-from">Date from</Label>
              <Input
                id="fin-from"
                type="date"
                value={draft.from}
                onChange={(e) => setDraft({ ...draft, from: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="fin-to">Date to</Label>
              <Input
                id="fin-to"
                type="date"
                value={draft.to}
                onChange={(e) => setDraft({ ...draft, to: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="fin-q">Search orders</Label>
            <Input
              id="fin-q"
              value={draft.q}
              placeholder="Customer or order #"
              onChange={(e) => setDraft({ ...draft, q: e.target.value })}
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-4">
          <button
            type="button"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:underline"
            onClick={clearAll}
          >
            Clear all
          </button>
          <Button onClick={apply} disabled={pending}>
            {pending ? "Applying…" : "Apply Filters"}
          </Button>
        </div>
      </Overlay>
    </>
  )
}
