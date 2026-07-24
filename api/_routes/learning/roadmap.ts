import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getUserFromRequest, getServiceSupabase, json, unauthorized } from '../../_lib/auth'
import { TABLES } from '../../_lib/tables'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' })

  const user = await getUserFromRequest(req)
  if (!user) return unauthorized(res)

  const supabase = getServiceSupabase()
  const { data } = await supabase
    .from(TABLES.learningRoadmap)
    .select('items')
    .eq('user_id', user.id)
    .single()

  return json(res, 200, { items: data?.items ?? [] })
}
