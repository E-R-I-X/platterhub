import Link from "next/link"
import { Button } from "@/components/ui/button"
import { profile } from "@/data/portfolio"

export function Contact() {
  return (
    <section
      id="contact"
      className="scroll-mt-8 border-t border-ink/10 py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <p className="text-sm tracking-[0.18em] text-sea uppercase">Contact</p>
        <h2 className="font-display mt-3 max-w-3xl text-4xl tracking-tight text-ink sm:text-5xl md:text-6xl">
          Have a product that needs a sharper path to ship?
        </h2>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Tell me what you’re building. I reply within a couple of weekdays.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button
            render={<Link href={`mailto:${profile.email}`} />}
            size="lg"
            className="h-11 rounded-md bg-sea px-5 text-primary-foreground hover:bg-sea-deep"
          >
            Email {profile.email}
          </Button>
          <p className="text-sm text-muted-foreground">
            Prefer async notes over discovery calls until there’s a fit.
          </p>
        </div>
      </div>
    </section>
  )
}
