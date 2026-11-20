import { cn } from "@/lib/utils"

export function StatCard({
  icon,
  label,
  value,
  hint,
  trend,
  className,
}: {
  icon: React.ReactNode
  label: string
  value: string
  hint?: string
  trend?: { label: string; positive?: boolean }
  className?: string
}) {
  return (
    <div className={cn("surface-card p-5 sm:p-6", className)}>
      <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-olive-soft text-olive">
        {icon}
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold tracking-tight text-olive sm:text-[1.7rem]">
        {value}
      </p>
      {trend ? (
        <p
          className={cn(
            "mt-2.5 text-xs font-medium",
            trend.positive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
          )}
        >
          {trend.label}
        </p>
      ) : null}
      {hint ? <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{hint}</p> : null}
    </div>
  )
}
