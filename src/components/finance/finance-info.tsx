"use client"

import { useState } from "react"
import { BarChart3, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Overlay, OverlayHeader } from "@/components/ui/overlay"
import { formatMoney } from "@/lib/format"

export function FinanceInfoButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="About revenue breakdown"
        onClick={() => setOpen(true)}
      >
        <Info className="size-4" />
      </button>
      <Overlay open={open} onClose={() => setOpen(false)} placement="center">
        <OverlayHeader title="Revenue breakdown" onClose={() => setOpen(false)} />
        <div className="px-5 py-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Revenue is the sum of <strong className="text-foreground">amount paid</strong> on
            orders in the selected date range. Percentages show each order type&apos;s share of
            that paid revenue. Outstanding balances are not included in revenue totals.
          </p>
        </div>
      </Overlay>
    </>
  )
}

export function FinanceReportButton({
  totalRevenue,
  outstanding,
  delivery,
  catering,
  dueCount,
}: {
  totalRevenue: number
  outstanding: number
  delivery: number
  catering: number
  dueCount: number
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <BarChart3 className="size-4" />
        View Full Report
      </Button>
      <Overlay open={open} onClose={() => setOpen(false)} placement="center">
        <OverlayHeader title="Revenue report" onClose={() => setOpen(false)} />
        <div className="space-y-3 px-5 py-4 text-sm">
          <Row label="Total revenue (paid)" value={formatMoney(totalRevenue)} />
          <Row label="Outstanding balance" value={formatMoney(outstanding)} />
          <Row label="Orders with balance due" value={String(dueCount)} />
          <div className="border-t border-border pt-3">
            <p className="mb-2 font-medium">By order type</p>
            <Row label="Event Catering" value={formatMoney(catering)} />
            <Row label="Food Delivery" value={formatMoney(delivery)} />
          </div>
          <p className="pt-2 text-xs text-muted-foreground">
            Figures update automatically when order totals or payments change.
          </p>
        </div>
      </Overlay>
    </>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}
