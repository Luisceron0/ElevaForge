/**
 * Startup check — coexisting legacy env admin + DB admin (RNF-SEC-04 / F-04).
 *
 * `ADMIN_USERNAME` / `ADMIN_PASSWORD` exist only to bootstrap the very first
 * login before any row exists in `admin_users` (see verifyAgainstLegacyEnv in
 * admin-session.ts). Once that username also has an *active* row in
 * `admin_users`, the legacy env credential is redundant and is a standing
 * plaintext-in-env credential that never expires or rotates — it should be
 * removed (see README.md § Panel de administración).
 *
 * This runs once per cold start via `instrumentation.ts` and only logs; it
 * never blocks startup, since a misconfigured check must not become a new
 * availability risk.
 */

import { logSecurityEvent } from '@/lib/security/logger'

export async function checkLegacyAdminCoexistence(): Promise<void> {
  const legacyUsername = process.env.ADMIN_USERNAME
  if (!legacyUsername) return

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) return

  try {
    const { createServerSupabaseClient } = await import('@/lib/supabase/server')
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('admin_users')
      .select('is_active')
      .eq('username', legacyUsername.trim().toLowerCase())
      .maybeSingle()

    if (error || !data || !data.is_active) return

    logSecurityEvent({
      type: 'LEGACY_ADMIN_CREDENTIAL_ACTIVE',
      ip: 'startup',
      path: 'instrumentation',
      details:
        `ADMIN_USERNAME ("${legacyUsername}") still set in env and also exists as an active admin_users row — ` +
        'remove ADMIN_USERNAME/ADMIN_PASSWORD from the environment now that bootstrap is complete (RNF-SEC-04).',
    })
  } catch {
    // Best-effort only — never fail startup over this check.
  }
}
