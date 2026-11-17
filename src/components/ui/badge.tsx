import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-olive-soft text-olive-dark",
        olive: "bg-olive text-white",
        soft: "bg-olive-soft text-olive",
        paid: "bg-emerald-50 text-emerald-700",
        pending: "bg-amber-50 text-amber-700",
        partial: "bg-orange-50 text-orange-700",
        failed: "bg-rose-50 text-rose-700",
        due: "bg-rose-50 text-rose-700",
        corporate: "bg-emerald-50 text-emerald-700",
        wedding: "bg-violet-50 text-violet-700",
        private: "bg-slate-100 text-slate-700",
        event: "bg-sky-50 text-sky-700",
        delivery: "bg-olive-soft text-olive-dark",
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
