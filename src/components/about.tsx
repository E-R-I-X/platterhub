import { principles, profile } from "@/data/portfolio"

export function About() {
  return (
    <section id="about" className="scroll-mt-8 border-t border-ink/10 py-20 sm:py-28">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="text-sm tracking-[0.18em] text-sea uppercase">About</p>
          <h2 className="font-display mt-3 text-4xl tracking-tight text-ink sm:text-5xl">
            How I work
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            {profile.summary}
          </p>
          <p className="mt-4 text-base text-muted-foreground">{profile.location}</p>
        </div>

        <ul className="space-y-8 lg:col-span-7 lg:pt-10">
          {principles.map((item) => (
            <li key={item.title} className="border-l-2 border-sea/40 pl-5">
              <h3 className="font-display text-2xl tracking-tight text-ink">
                {item.title}
              </h3>
              <p className="mt-2 max-w-xl text-base leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
