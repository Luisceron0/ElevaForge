import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Singleton: reuse a single Supabase client across invocations in the same
// cold-start to avoid re-creating the HTTP transport each time.
let _cached: SupabaseClient | null = null

export function createServerSupabaseClient(): SupabaseClient {
  if (_cached) return _cached

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase environment variables')
  }

  _cached = createClient(supabaseUrl, serviceRoleKey)
  return _cached
}
