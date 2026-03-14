import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
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

  if (await isActiveAdminUser(username)) return true

  return isLegacyAdminUsername(username)
}

export async function hasActiveAdminSession(): Promise<boolean> {
  const store = await cookies()
  const token = store.get(getAdminCookieName())?.value
  const username = getSessionUsername(token)
  if (!username) return false

  if (!supabaseConfigured()) return isLegacyAdminUsername(username)

  if (await isActiveAdminUser(username)) return true

  return isLegacyAdminUsername(username)
}
