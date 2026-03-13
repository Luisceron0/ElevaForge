import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getAdminCookieName, getSessionUsername } from '@/lib/security/admin-session'

function supabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

async function isActiveAdminUser(username: string): Promise<boolean> {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('admin_users')
      .select('is_active')
      .eq('username', username)
      .maybeSingle()

    if (error || !data) return false
    return Boolean(data.is_active)
  } catch {
    return false
  }
}

export async function hasActiveAdminSessionInRequest(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(getAdminCookieName())?.value
  const username = getSessionUsername(token)
  if (!username) return false

  // If Supabase is not configured, trust the HMAC-signed session token alone.
  // This allows the admin to work with legacy env-var credentials while
  // Supabase is being set up.
  if (!supabaseConfigured()) return true

  return isActiveAdminUser(username)
}
