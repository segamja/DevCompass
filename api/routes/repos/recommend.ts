import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getUserFromRequest, getServiceSupabase, json, unauthorized } from '../../lib/auth.js'
import { TABLES } from '../../lib/tables.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' })

  const user = await getUserFromRequest(req)
  if (!user) return unauthorized(res)

  const supabase = getServiceSupabase()
  const { data } = await supabase
    .from(TABLES.repoRecommendations)
    .select('repos')
    .eq('user_id', user.id)
    .single()

  return json(res, 200, { repos: data?.repos ?? [] })
}
