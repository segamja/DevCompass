import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getUserFromRequest, json, unauthorized } from '../../_lib/auth'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' })
  const user = await getUserFromRequest(req)
  if (!user) return unauthorized(res)

  req.method = 'GET'
  const weeklyHandler = (await import('./weekly')).default
  return weeklyHandler(req, res)
}
