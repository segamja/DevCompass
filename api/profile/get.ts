import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getUserFromRequest, getServiceSupabase, json, unauthorized } from '../_lib/auth'
import { TABLES } from '../_lib/tables'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' })

  const user = await getUserFromRequest(req)
  if (!user) return unauthorized(res)

  const supabase = getServiceSupabase()
  const { data } = await supabase
    .from(TABLES.profiles)
    .select('*')
    .eq('id', user.id)
    .single()

  return json(res, 200, {
    profile: data
      ? {
          id: data.id,
          github_username: data.github_username,
          avatar_url: data.avatar_url,
          bio: data.bio,
          public_repos: data.public_repos,
          followers: data.followers,
          created_at: data.created_at,
        }
      : null,
  })
}
