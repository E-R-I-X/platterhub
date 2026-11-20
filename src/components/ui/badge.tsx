import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-olive-soft text-olive",
        olive: "bg-olive text-on-olive",
        soft: "bg-olive-soft text-olive",
        paid: "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
        pending: "bg-amber-50 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
        partial: "bg-orange-50 text-orange-800 dark:bg-orange-500/15 dark:text-orange-300",
        failed: "bg-rose-50 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300",
        due: "bg-rose-50 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300",
        corporate: "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
        wedding: "bg-violet-50 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300",
        private: "bg-slate-100 text-slate-800 dark:bg-slate-500/15 dark:text-slate-300",
        event: "bg-sky-50 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300",
        delivery: "bg-olive-soft text-olive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
