import { profile } from "@/data/portfolio"

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="font-display text-base text-ink">{profile.name}</p>
        <p>© 2026 · Built as a living portfolio</p>
      </div>
    </footer>
  )
}
