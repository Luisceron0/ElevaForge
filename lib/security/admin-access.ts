import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getAdminCookieName, getSessionUsername } from '@/lib/security/admin-session'

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
  return isActiveAdminUser(username)
}
