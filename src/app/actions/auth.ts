"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getDemoCredentials } from "@/lib/auth"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/server"

const DEMO_COOKIE = "platter_hub_session"

export type AuthState = {
  error?: string
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim().toLowerCase()
  const password = String(formData.get("password") || "")

  if (!email || !password) {
    return { error: "Email and password are required." }
  }

  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    redirect("/dashboard")
  }

  const demo = getDemoCredentials()
  if (email !== demo.email.toLowerCase() || password !== demo.password) {
    return {
      error: `Invalid credentials. Demo login: ${demo.email} / ${demo.password}`,
    }
  }

  const cookieStore = await cookies()
  cookieStore.set(
    DEMO_COOKIE,
    JSON.stringify({ email: demo.email, name: "Admin User" }),
    {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    }
  )

  redirect("/dashboard")
}

export async function logoutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    await supabase.auth.signOut()
  }

  const cookieStore = await cookies()
  cookieStore.delete(DEMO_COOKIE)
  redirect("/login")
}
