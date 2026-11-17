import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { profile } from "@/data/portfolio"

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate min-h-[100svh] overflow-hidden text-white"
    >
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero.jpg"
          alt="Sunlit open office with long tables and city windows"
          fill
          priority
          sizes="100vw"
          className="hero-drift object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(11,28,36,0.88)_8%,rgba(15,76,106,0.62)_48%,rgba(11,28,36,0.55)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_35%,rgba(255,255,255,0.18),transparent_42%)]" />
      </div>

      <div className="mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-end px-5 pb-16 pt-28 sm:px-8 sm:pb-20">
        <p className="reveal font-display text-[clamp(4.5rem,18vw,11rem)] leading-[0.85] font-semibold tracking-[-0.04em]">
          {profile.name}
        </p>
        <h1 className="reveal reveal-delay-1 mt-6 max-w-2xl text-balance text-2xl leading-snug font-medium tracking-tight sm:text-3xl md:text-4xl">
          {profile.tagline}
        </h1>
        <p className="reveal reveal-delay-2 mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
          {profile.role}. From discovery to launch, I keep product decisions
          concrete and the next build obvious.
        </p>
        <div className="reveal reveal-delay-3 mt-8 flex flex-wrap items-center gap-3">
          <Button
            render={<Link href="#work" />}
            size="lg"
            className="h-11 rounded-md bg-white px-5 text-ink hover:bg-white/90"
          >
            View selected work
          </Button>
          <Button
            render={<Link href="#contact" />}
            variant="outline"
            size="lg"
            className="h-11 rounded-md border-white/35 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white"
          >
            Get in touch
          </Button>
        </div>
      </div>
    </section>
  )
}
