import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-olive text-on-olive hover:bg-olive-dark",
        outline:
          "border-border bg-card text-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted",
        secondary:
          "bg-olive-soft text-olive hover:bg-olive-muted aria-expanded:bg-olive-soft",
        ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted",
        destructive:
          "bg-destructive/15 text-destructive hover:bg-destructive/25 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        link: "text-olive underline-offset-4 hover:underline",
        /* Light CTA on dark heroes — fixed dark text so contrast holds in dark mode */
        hero: "border-transparent bg-white text-[#1c2414] hover:bg-[#eef2e6] hover:text-[#3f5122]",
        "hero-outline":
          "border-white/30 bg-white/10 text-white hover:bg-white/15 hover:text-white",
      },
      size: {
        default: "h-10 gap-1.5 px-4",
        xs: "h-6 gap-1 rounded-md px-2 text-xs",
        sm: "h-8 gap-1 rounded-lg px-3 text-[0.8rem]",
        lg: "h-11 gap-2 px-5",
        icon: "size-10",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
