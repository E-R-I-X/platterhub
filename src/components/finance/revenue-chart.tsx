"use client"

import { formatMoney } from "@/lib/format"

export type RevenuePoint = {
  label: string
  revenue: number
  outstanding: number
}

export function RevenueChart({
  points,
}: {
  points: RevenuePoint[]
}) {
  const width = 640
  const height = 220
  const padX = 16
  const padY = 20
  const max = Math.max(...points.map((p) => Math.max(p.revenue, p.outstanding)), 1)

  const coords = points.map((p, i) => {
    const x =
      padX + (i / Math.max(points.length - 1, 1)) * (width - padX * 2)
    const yRev =
      height - padY - (p.revenue / max) * (height - padY * 2)
    const yOut =
      height - padY - (p.outstanding / max) * (height - padY * 2)
    return { ...p, x, yRev, yOut }
  })

  function path(key: "yRev" | "yOut") {
    return coords
      .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c[key].toFixed(1)}`)
      .join(" ")
  }

  const area =
    coords.length > 0
      ? `${path("yRev")} L ${coords[coords.length - 1].x.toFixed(1)} ${height - padY} L ${coords[0].x.toFixed(1)} ${height - padY} Z`
      : ""

  const latest = points[points.length - 1]

  return (
    <div className="surface-card overflow-hidden">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 className="font-semibold tracking-tight">Revenue trend</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Paid revenue vs outstanding by week
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-olive" />
            Revenue
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-amber-500" />
            Outstanding
          </span>
          {latest ? (
            <span className="font-medium text-olive">{formatMoney(latest.revenue)}</span>
          ) : null}
        </div>
      </div>

      <div className="px-2 pt-4 pb-2 sm:px-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-48 w-full sm:h-56"
          role="img"
          aria-label="Revenue trend chart"
        >
          {[0.25, 0.5, 0.75, 1].map((t) => {
            const y = height - padY - t * (height - padY * 2)
            return (
              <line
                key={t}
                x1={padX}
                x2={width - padX}
                y1={y}
                y2={y}
                stroke="currentColor"
                className="text-border"
                strokeWidth="1"
              />
            )
          })}
          <path d={area} className="fill-olive/15" />
          <path
            d={path("yRev")}
            fill="none"
            stroke="currentColor"
            className="text-olive"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={path("yOut")}
            fill="none"
            stroke="currentColor"
            className="text-amber-500"
            strokeWidth="2"
            strokeDasharray="5 5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {coords.map((c) => (
            <g key={c.label}>
              <circle cx={c.x} cy={c.yRev} r="4" className="fill-olive" />
              <circle cx={c.x} cy={c.yOut} r="3.5" className="fill-amber-500" />
            </g>
          ))}
        </svg>
        <div className="mt-1 grid grid-cols-6 gap-1 px-2 pb-4 text-center text-[10px] text-muted-foreground sm:text-xs">
          {points.map((p) => (
            <span key={p.label} className="truncate">
              {p.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
