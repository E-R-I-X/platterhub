import "server-only"
import { createClient } from "@supabase/supabase-js"
import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/supabase/config"

/** Service-role client for server-side data access (bypasses RLS). */
export function createAdminClient() {
  if (!isSupabaseConfigured()) return null

  const { url } = getSupabaseEnv()
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export function canUseSupabaseData() {
  return Boolean(createAdminClient())
}
