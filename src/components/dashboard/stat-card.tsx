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
          ? "border-olive/30 bg-gradient-to-br from-olive to-olive-dark text-on-olive shadow-[0_18px_40px_-24px_rgba(85,107,47,0.8)]"
          : "surface-card",
        className
      )}
    >
      {!accent ? (
        <div className="absolute top-0 left-0 h-full w-1 bg-olive/70" />
      ) : (
        <div className="pointer-events-none absolute -right-8 -bottom-10 size-36 rounded-full bg-on-olive/10 blur-2xl" />
      )}
      <div
        className={cn(
          "mb-4 flex size-11 items-center justify-center rounded-2xl",
          accent ? "bg-on-olive/15 text-on-olive" : "bg-olive-soft text-olive"
        )}
      >
        {icon}
      </div>
      <p className={cn("text-sm", accent ? "text-on-olive/80" : "text-muted-foreground")}>
        {label}
      </p>
      <p
        className={cn(
          "mt-1.5 text-2xl font-semibold tracking-tight sm:text-[1.7rem]",
          accent ? "text-on-olive" : "text-olive"
        )}
      >
        {value}
      </p>
      {trend ? (
        <p
          className={cn(
            "mt-2.5 text-xs font-medium",
            accent
              ? "text-on-olive/75"
              : trend.positive
                ? "text-emerald-700 dark:text-emerald-300"
                : "text-rose-700 dark:text-rose-300"
          )}
        >
          {trend.label}
        </p>
      ) : null}
      {hint ? (
        <p
          className={cn(
            "mt-2 text-xs leading-relaxed",
            accent ? "text-on-olive/70" : "text-muted-foreground"
          )}
        >
          {hint}
        </p>
      ) : null}
    </div>
  )
}
