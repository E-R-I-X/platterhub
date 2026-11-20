"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function Pagination({
  page,
  pageCount,
  total,
  pageSize,
  basePath,
  query = {},
}: {
  page: number
  pageCount: number
  total: number
  pageSize: number
  basePath: string
  query?: Record<string, string | undefined>
}) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  function hrefFor(p: number) {
    const params = new URLSearchParams()
    Object.entries(query).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    if (p > 1) params.set("page", String(p))
    const qs = params.toString()
    return qs ? `${basePath}?${qs}` : basePath
  }

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).slice(0, 5)

  return (
    <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {start} to {end} of {total} {total === 1 ? "item" : "items"}
      </p>
      <div className="flex items-center gap-1">
        <Link
          href={hrefFor(Math.max(1, page - 1))}
          className={cn(
            "flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted",
            page <= 1 && "pointer-events-none opacity-40"
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </Link>
        {pages.map((p) => (
          <Link
            key={p}
            href={hrefFor(p)}
            className={cn(
              "flex size-8 items-center justify-center rounded-lg text-sm font-medium",
              p === page
                ? "bg-olive text-on-olive"
                : "border border-border text-muted-foreground hover:bg-muted"
            )}
          >
            {p}
          </Link>
        ))}
        <Link
          href={hrefFor(Math.min(pageCount, page + 1))}
          className={cn(
            "flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted",
            page >= pageCount && "pointer-events-none opacity-40"
          )}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Link>
      </div>
    </div>
  )
}
