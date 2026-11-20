"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Viewport-fixed overlay via portal. Avoids `position: fixed` being trapped
 * by transformed ancestors (e.g. page enter animations).
 */
export function Overlay({
  open,
  onClose,
  children,
  className,
  panelClassName,
  placement = "center",
}: {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  panelClassName?: string
  placement?: "center" | "bottom" | "right"
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [open, onClose])

  if (!open || !mounted) return null

  const placementClass =
    placement === "right"
      ? "items-end justify-end md:items-stretch md:justify-end md:p-4"
      : placement === "bottom"
        ? "items-end justify-center sm:items-center sm:p-4"
        : "items-end justify-center sm:items-center sm:p-4"

  const panelAnim =
    placement === "right"
      ? "overlay-panel-right"
      : "overlay-panel-up"

  return createPortal(
    <div className={cn("fixed inset-0 z-[100] flex", placementClass, className)}>
      <button
        type="button"
        className="overlay-backdrop absolute inset-0 bg-[#1c2414]/45 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        className={cn(
          "overlay-panel relative z-10 w-full max-w-md overflow-hidden border border-border bg-card shadow-2xl",
          panelAnim,
          placement === "right"
            ? "max-h-[92dvh] rounded-t-[1.75rem] md:my-0 md:mr-0 md:max-h-full md:rounded-3xl"
            : "max-h-[90dvh] rounded-t-[1.75rem] sm:rounded-3xl",
          panelClassName
        )}
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>,
    document.body
  )
}

export function OverlayHeader({
  title,
  description,
  onClose,
}: {
  title: string
  description?: string
  onClose: () => void
}) {
  return (
    <div className="shrink-0 border-b border-border">
      <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-border sm:hidden" />
      <div className="flex items-start justify-between gap-3 px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          {description ? (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
        <button
          type="button"
          className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  )
}
