"use client"

import { useMemo, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
          "relative inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium hover:bg-muted",
          activeCount > 0 && "border-olive text-olive"
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

      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-0 md:items-center md:justify-center md:p-6">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 mt-auto w-full rounded-t-2xl border border-border bg-card p-5 shadow-xl md:mt-0 md:max-w-md md:rounded-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Finance filters</h2>
              <button
                type="button"
                className="rounded-lg p-2 hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="space-y-4">
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
            <div className="mt-5 flex items-center justify-between">
              <button
                type="button"
                className="text-sm font-medium text-muted-foreground hover:underline"
                onClick={clearAll}
              >
                Clear all
              </button>
              <Button onClick={apply} disabled={pending}>
                {pending ? "Applying…" : "Apply Filters"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
