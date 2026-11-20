import { cn } from "@/lib/utils"

export function SectionHero({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "relative mb-6 overflow-hidden rounded-[1.75rem] border border-olive/20 text-white shadow-[0_20px_50px_-28px_rgba(28,36,20,0.45)] sm:mb-8",
        className
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 12% 20%, rgba(85,107,47,0.9), transparent 42%), radial-gradient(ellipse at 88% 10%, rgba(216,224,200,0.25), transparent 36%), linear-gradient(135deg, #1c2414 0%, #2f3d1c 55%, #556b2f 140%)",
        }}
      />
      <div className="relative flex flex-col gap-5 px-5 py-7 sm:flex-row sm:items-end sm:justify-between sm:px-7 sm:py-8">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-xs tracking-[0.2em] text-olive-muted uppercase">{eyebrow}</p>
          ) : null}
          <h1 className="font-display mt-2 text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </section>
  )
}
