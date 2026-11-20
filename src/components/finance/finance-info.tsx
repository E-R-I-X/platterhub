"use client"

import { useState } from "react"
import { BarChart3, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatMoney } from "@/lib/format"

export function FinanceInfoButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label="About revenue breakdown"
        onClick={() => setOpen(true)}
      >
        <Info className="size-4" />
      </button>
      {open ? (
        <Modal onClose={() => setOpen(false)} title="Revenue breakdown">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Revenue is the sum of <strong className="text-foreground">amount paid</strong> on
            orders in the selected date range. Percentages show each order type&apos;s share of
            that paid revenue. Outstanding balances are not included in revenue totals.
          </p>
        </Modal>
      ) : null}
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
      {open ? (
        <Modal onClose={() => setOpen(false)} title="Revenue report">
          <div className="space-y-3 text-sm">
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
        </Modal>
      ) : null}
    </>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button type="button" className="rounded-lg p-1 hover:bg-muted" onClick={onClose}>
            <X className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
