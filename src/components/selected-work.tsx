import Image from "next/image"
import { projects } from "@/data/portfolio"

export function SelectedWork() {
  return (
    <section id="work" className="scroll-mt-8 border-t border-ink/10 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-sm tracking-[0.18em] text-sea uppercase">Selected work</p>
          <h2 className="font-display mt-3 text-4xl tracking-tight text-ink sm:text-5xl">
            Products shaped end to end
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            A few launches where the brief was fuzzy, the stakes were real, and
            the outcome had to be usable on day one.
          </p>
        </div>

        <ul className="mt-14 space-y-16 sm:mt-16 sm:space-y-20">
          {projects.map((project, index) => (
            <li
              key={project.slug}
              className="group grid items-end gap-6 border-t border-ink/10 pt-8 lg:grid-cols-12 lg:gap-10"
            >
              <div className="lg:col-span-5">
                <div className="flex items-baseline gap-3 text-sm text-muted-foreground">
                  <span className="font-mono text-sea">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{project.year}</span>
                  <span aria-hidden>·</span>
                  <span>{project.role}</span>
                </div>
                <h3 className="font-display mt-3 text-3xl tracking-tight text-ink transition-colors group-hover:text-sea sm:text-4xl">
                  {project.title}
                </h3>
                <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                  {project.summary}
                </p>
                <p className="mt-5 text-sm font-medium text-ink">
                  {project.outcome}
                </p>
              </div>

              <div className="relative aspect-[16/10] overflow-hidden lg:col-span-7">
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(11,28,36,0.18)_100%)]" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
