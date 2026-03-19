import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getAdminCookieName, getSessionUsername } from '@/lib/security/admin-session'

function supabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

/**
 * Three-state DB lookup to distinguish 'not found' from 'found but inactive'.
 * This prevents deactivated admins from bypassing DB controls via the legacy
 * env-var fallback — OWASP A01 (Broken Access Control).
 */
type AdminStatus = 'active' | 'inactive' | 'not-found'

async function getAdminUserStatus(username: string): Promise<AdminStatus> {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('admin_users')
      .select('is_active')
      .eq('username', username)
      .maybeSingle()

    if (error) return 'not-found'
    if (!data) return 'not-found'
    return data.is_active ? 'active' : 'inactive'
  } catch {
    return 'not-found'
  }
}

function isLegacyAdminUsername(username: string): boolean {
  const legacy = process.env.ADMIN_USERNAME
  if (!legacy) return false
  return username.trim().toLowerCase() === legacy.trim().toLowerCase()
}

export async function hasActiveAdminSessionInRequest(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(getAdminCookieName())?.value
  const username = getSessionUsername(token)
  if (!username) return false

  if (!supabaseConfigured()) return isLegacyAdminUsername(username)

  const status = await getAdminUserStatus(username)
  if (status === 'active') return true
  if (status === 'inactive') return false // explicitly deactivated — no legacy bypass
  // 'not-found': user not in DB yet → support legacy migration accounts
  return isLegacyAdminUsername(username)
}

export async function hasActiveAdminSession(): Promise<boolean> {
  const store = await cookies()
  const token = store.get(getAdminCookieName())?.value
  const username = getSessionUsername(token)
  if (!username) return false

  if (!supabaseConfigured()) return isLegacyAdminUsername(username)

  const status = await getAdminUserStatus(username)
  if (status === 'active') return true
  if (status === 'inactive') return false // explicitly deactivated — no legacy bypass
  // 'not-found': user not in DB yet → support legacy migration accounts
  return isLegacyAdminUsername(username)
}
