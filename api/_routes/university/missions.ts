import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getUserFromRequest, getServiceSupabase, json, unauthorized } from '../../_lib/auth'
import { TABLES } from '../../_lib/tables'

const DEFAULT_MISSIONS = [
  { id: 'd1', type: 'daily', title: 'Write a meaningful commit message', description: 'Practice clear commit messages following conventional commits.', completed: false, points: 10 },
  { id: 'd2', type: 'daily', title: 'Review one open source PR', description: 'Read and understand a pull request in a repo you starred.', completed: false, points: 15 },
  { id: 'w1', type: 'weekly', title: 'Improve your README', description: 'Add architecture diagram and setup instructions to a project README.', completed: false, points: 50 },
  { id: 'w2', type: 'weekly', title: 'Contribute to discussions', description: 'Participate in 3 GitHub issues or discussions this week.', completed: false, points: 40 },
]

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = await getUserFromRequest(req)
  if (!user) return unauthorized(res)

  const supabase = getServiceSupabase()

  if (req.method === 'GET') {
    const { data } = await supabase.from(TABLES.universityMissions).select('missions').eq('user_id', user.id).single()
    if (!data?.missions) {
      await supabase.from(TABLES.universityMissions).upsert({ user_id: user.id, missions: DEFAULT_MISSIONS })
      return json(res, 200, { missions: DEFAULT_MISSIONS })
    }
    return json(res, 200, { missions: data.missions })
  }

  if (req.method === 'POST') {
    const { missionId } = req.body as { missionId?: string }
    const { data } = await supabase.from(TABLES.universityMissions).select('missions').eq('user_id', user.id).single()
    const missions = (data?.missions || DEFAULT_MISSIONS).map((m: { id: string; completed: boolean }) =>
      m.id === missionId ? { ...m, completed: true } : m,
    )
    await supabase.from(TABLES.universityMissions).upsert({ user_id: user.id, missions })
    return json(res, 200, { success: true })
  }

  return json(res, 405, { error: 'Method not allowed' })
}
