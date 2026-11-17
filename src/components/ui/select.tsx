import { cn } from "@/lib/utils"

function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="select"
      className={cn(
        "flex h-10 w-full appearance-none rounded-lg border border-input bg-white px-3 py-2 text-sm text-foreground transition-colors focus-visible:border-olive focus-visible:ring-3 focus-visible:ring-olive/20 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}

export { Select }
