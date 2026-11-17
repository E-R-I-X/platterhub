import { Suspense } from "react"
import { requireUser } from "@/lib/auth"
import { AppShell } from "@/components/layout/app-shell"

export const instant = false

async function AuthenticatedShell({ children }: { children: React.ReactNode }) {
  const user = await requireUser()
  return <AppShell userName={user.name}>{children}</AppShell>
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-canvas text-sm text-muted-foreground">
          Loading workspace…
        </div>
      }
    >
      <AuthenticatedShell>{children}</AuthenticatedShell>
    </Suspense>
  )
}
