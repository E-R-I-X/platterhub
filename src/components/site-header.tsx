import Link from "next/link"
import { profile } from "@/data/portfolio"

const links = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
]

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link
          href="#top"
          className="font-display text-lg font-semibold tracking-tight text-white underline-draw"
        >
          {profile.name}
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-5 sm:gap-7">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/85 underline-draw transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
