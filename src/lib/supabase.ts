import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      detectSessionInUrl: true,
      flowType: 'pkce',
      persistSession: true,
      autoRefreshToken: true,
    },
  },
)

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project') &&
  supabaseAnonKey !== 'your-anon-key',
)

/** Canonical production URL (optional). Used for error messages, not OAuth redirects. */
export function getCanonicalAppOrigin(): string | undefined {
  return import.meta.env.VITE_APP_URL?.replace(/\/$/, '')
}

/** OAuth callback origin — must match where login started (PKCE verifier in localStorage). */
export function getAppOrigin(): string {
  return window.location.origin
}

export function getAuthRedirectUrl(path = '/auth/callback') {
  return `${getAppOrigin()}${path}`
}
