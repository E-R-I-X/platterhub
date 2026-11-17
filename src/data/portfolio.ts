export const profile = {
  name: "Eri",
  role: "Product manager & builder",
  email: "hello@eri.studio",
  location: "Remote · worldwide",
  tagline: "I turn messy product problems into clear, shippable software.",
  summary:
    "I partner with designers and engineers to shape roadmaps, cut scope without losing ambition, and get useful interfaces into people’s hands.",
}

export const projects = [
  {
    slug: "atlas",
    title: "Atlas Ops",
    year: "2025",
    role: "Product lead",
    summary:
      "A planning surface for multi-team launches — timelines, owners, and risks in one calm view.",
    outcome: "Cut weekly status meetings by 40%",
    image: "/images/work-atlas.jpg",
    imageAlt: "Analytics dashboard on a laptop in a bright workspace",
  },
  {
    slug: "ledger",
    title: "Ledger North",
    year: "2024",
    role: "PM + prototyper",
    summary:
      "Finance workflows rebuilt around exceptions first, so teams spend time on the few things that matter.",
    outcome: "Exception triage time down from days to hours",
    image: "/images/work-ledger.jpg",
    imageAlt: "Desk with charts and planning notes",
  },
  {
    slug: "harbor",
    title: "Harbor Studio",
    year: "2024",
    role: "Founding PM",
    summary:
      "A lightweight research library that keeps interviews, clips, and decisions searchable for the whole product org.",
    outcome: "Research reuse up across three product squads",
    image: "/images/work-harbor.jpg",
    imageAlt: "Team collaborating around a table with laptops",
  },
] as const

export const principles = [
  {
    title: "Clarity over theater",
    body: "Roadmaps should explain tradeoffs, not decorate slides.",
  },
  {
    title: "Ship the thin wedge",
    body: "A narrow slice that works beats a platform that almost does.",
  },
  {
    title: "Sit with the craft",
    body: "I write specs, poke at prototypes, and stay close to the build.",
  },
] as const
