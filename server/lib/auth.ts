import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { TABLES } from './tables.js'

export function getServiceSupabase(): SupabaseClient {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase service role not configured')
  return createClient(url, key)
}

export async function getUserFromRequest(req: VercelRequest) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return null

  const token = auth.slice(7)
  const supabase = getServiceSupabase()
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return null
  return user
}

export function json(res: VercelResponse, status: number, data: unknown) {
  res.status(status).json(data)
}

export function methodNotAllowed(res: VercelResponse) {
  json(res, 405, { error: 'Method not allowed' })
}

export function unauthorized(res: VercelResponse) {
  json(res, 401, { error: 'Unauthorized' })
}

export async function getGitHubToken(userId: string): Promise<string | null> {
  const supabase = getServiceSupabase()

  const { data: tokenRow } = await supabase
    .from(TABLES.githubTokens)
    .select('access_token')
    .eq('user_id', userId)
    .single()

  if (tokenRow?.access_token) return tokenRow.access_token

  const { data: { user }, error } = await supabase.auth.admin.getUserById(userId)
  if (error || !user) return null

  const githubIdentity = user.identities?.find((i) => i.provider === 'github')
  return (
    (githubIdentity?.identity_data as { access_token?: string })?.access_token ||
    (user.app_metadata as { provider_token?: string })?.provider_token ||
    null
  )
}

export async function storeGitHubToken(userId: string, accessToken: string) {
  const supabase = getServiceSupabase()
  await supabase.from(TABLES.githubTokens).upsert({
    user_id: userId,
    access_token: accessToken,
    updated_at: new Date().toISOString(),
  })
}
