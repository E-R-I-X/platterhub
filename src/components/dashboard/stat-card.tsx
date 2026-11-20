import { cn } from "@/lib/utils"

export function StatCard({
  icon,
  label,
  value,
  hint,
  trend,
  accent = false,
  className,
}: {
  icon: React.ReactNode
  label: string
  value: string
  hint?: string
  trend?: { label: string; positive?: boolean }
  accent?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.35rem] border p-5 sm:p-6",
        accent
          ? "border-olive/25 bg-gradient-to-br from-olive to-olive-dark text-white shadow-[0_18px_40px_-24px_rgba(85,107,47,0.8)]"
          : "surface-card",
        className
      )}
    >
      {!accent ? (
        <div className="absolute top-0 left-0 h-full w-1 bg-olive/70" />
      ) : (
        <div className="pointer-events-none absolute -right-8 -bottom-10 size-36 rounded-full bg-white/10 blur-2xl" />
      )}
      <div
        className={cn(
          "mb-4 flex size-11 items-center justify-center rounded-2xl",
          accent ? "bg-white/15 text-white" : "bg-olive-soft text-olive"
        )}
      >
        {icon}
      </div>
      <p className={cn("text-sm", accent ? "text-white/75" : "text-muted-foreground")}>
        {label}
      </p>
      <p
        className={cn(
          "mt-1.5 text-2xl font-semibold tracking-tight sm:text-[1.7rem]",
          accent ? "text-white" : "text-olive"
        )}
      >
        {value}
      </p>
      {trend ? (
        <p
          className={cn(
            "mt-2.5 text-xs font-medium",
            accent
              ? "text-white/70"
              : trend.positive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
          )}
        >
          {trend.label}
        </p>
      ) : null}
      {hint ? (
        <p
          className={cn(
            "mt-2 text-xs leading-relaxed",
            accent ? "text-white/65" : "text-muted-foreground"
          )}
        >
          {hint}
        </p>
      ) : null}
    </div>
  )
}
