import { createClient } from '@supabase/supabase-js'

export function createClientSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  // Use the public anon key for client-side usage. This file must only be
  // imported from client/SSR contexts. Server-only code must use
  // SUPABASE_SERVICE_ROLE_KEY in `lib/supabase/server.ts`.
  return createClient(supabaseUrl, supabaseAnonKey)
}
