import "server-only"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/server"

const DEMO_COOKIE = "platter_hub_session"

export type AuthUser = {
  id: string
  email: string
  name: string
  mode: "supabase" | "demo"
}

export async function getSessionUser(): Promise<AuthUser | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient()
      const { data } = await supabase.auth.getUser()
      if (!data.user?.email) return null
      return {
        id: data.user.id,
        email: data.user.email,
        name:
          (data.user.user_metadata?.full_name as string | undefined) ||
          data.user.email.split("@")[0],
        mode: "supabase",
      }
    } catch {
      return null
    }
  }

  const cookieStore = await cookies()
  const session = cookieStore.get(DEMO_COOKIE)?.value
  if (!session) return null

  try {
    const parsed = JSON.parse(session) as { email: string; name: string }
    return {
      id: "demo-owner",
      email: parsed.email,
      name: parsed.name,
      mode: "demo",
    }
  } catch {
    return null
  }
}

export async function requireUser(): Promise<AuthUser> {
  const user = await getSessionUser()
  if (!user) redirect("/login")
  return user
}

export function getDemoCredentials() {
  return {
    email: process.env.DEMO_EMAIL || "owner@platterhub.ng",
    password: process.env.DEMO_PASSWORD || "platterhub",
  }
}
