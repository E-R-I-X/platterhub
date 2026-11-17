import "server-only"
import { headers } from "next/headers"
import { connection } from "next/server"
import { redirect } from "next/navigation"
import { getIdentity } from "../../cursor/identity"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/server"

export type AuthUser = {
  id: string
  email: string
  name: string
  mode: "supabase" | "cursor"
}

export async function getSessionUser(): Promise<AuthUser | null> {
  await connection()

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

  const identity = await getIdentity(await headers())
  if (!identity.verified) return null
  if (identity.kind === "key") return null

  return {
    id: identity.sub,
    email: identity.email || "owner@local.dev",
    name: identity.name || "Owner",
    mode: "cursor",
  }
}

export async function requireUser(): Promise<AuthUser> {
  const user = await getSessionUser()
  if (!user) redirect("/login")
  return user
}
