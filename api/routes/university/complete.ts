import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getUserFromRequest, getServiceSupabase, json, methodNotAllowed, unauthorized } from '../../lib/auth'
import { TABLES } from '../../lib/tables'

const DEFAULT_MISSIONS = [
  { id: 'd1', type: 'daily', title: 'Write a meaningful commit message', description: 'Practice clear commit messages following conventional commits.', completed: false, points: 10 },
  { id: 'd2', type: 'daily', title: 'Review one open source PR', description: 'Read and understand a pull request in a repo you starred.', completed: false, points: 15 },
  { id: 'w1', type: 'weekly', title: 'Improve your README', description: 'Add architecture diagram and setup instructions to a project README.', completed: false, points: 50 },
  { id: 'w2', type: 'weekly', title: 'Contribute to discussions', description: 'Participate in 3 GitHub issues or discussions this week.', completed: false, points: 40 },
]

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return methodNotAllowed(res)

  const user = await getUserFromRequest(req)
  if (!user) return unauthorized(res)

  const { missionId } = (req.body || {}) as { missionId?: string }
  if (!missionId) return json(res, 400, { error: 'missionId required' })

  const supabase = getServiceSupabase()
  const { data } = await supabase.from(TABLES.universityMissions).select('missions').eq('user_id', user.id).single()
  const missions = (data?.missions || DEFAULT_MISSIONS).map((m: { id: string; completed: boolean }) =>
    m.id === missionId ? { ...m, completed: true } : m,
  )
  await supabase.from(TABLES.universityMissions).upsert({ user_id: user.id, missions })
  return json(res, 200, { success: true })
}
