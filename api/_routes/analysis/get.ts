import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getUserFromRequest, getServiceSupabase, json, unauthorized } from '../../_lib/auth'
import { TABLES } from '../../_lib/tables'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' })

  const user = await getUserFromRequest(req)
  if (!user) return unauthorized(res)

  const supabase = getServiceSupabase()
  const { data, error: dbError } = await supabase
    .from(TABLES.analysisResults)
    .select('result')
    .eq('user_id', user.id)
    .maybeSingle()

  if (dbError) {
    return json(res, 500, { error: dbError.message })
  }

  return json(res, 200, { analysis: data?.result ?? null })
}
