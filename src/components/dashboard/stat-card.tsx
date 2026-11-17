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
    <div
      className={cn(
        "rounded-xl border border-border bg-white p-5 shadow-[0_1px_2px_rgba(28,36,20,0.04)]",
        className
      )}
    >
      <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-olive-soft text-olive">
        {icon}
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-olive">{value}</p>
      {trend ? (
        <p
          className={cn(
            "mt-2 text-xs font-medium",
            trend.positive ? "text-emerald-600" : "text-rose-600"
          )}
        >
          {trend.label}
        </p>
      ) : null}
      {hint ? <p className="mt-2 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}
