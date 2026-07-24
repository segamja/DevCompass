import { useAuth } from '@/hooks/useAuth'

/** Keeps Supabase session synced app-wide (including /auth/callback). */
export function AuthBootstrap() {
  useAuth()
  return null
}
