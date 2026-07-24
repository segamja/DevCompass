import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getUserFromRequest, getServiceSupabase, getGitHubToken, storeGitHubToken, json, methodNotAllowed, unauthorized } from '../../lib/auth'
import { collectGitHubData } from '../../lib/github'
import { TABLES } from '../../lib/tables'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return methodNotAllowed(res)

  const user = await getUserFromRequest(req)
  if (!user) return unauthorized(res)

  try {
    const { providerToken } = (req.body || {}) as { providerToken?: string }

    let githubToken = providerToken || await getGitHubToken(user.id)

    if (!githubToken) {
      const authHeader = req.headers.authorization!
      const sessionToken = authHeader.slice(7)
      const supabase = getServiceSupabase()
      const { data: { user: fullUser } } = await supabase.auth.getUser(sessionToken)
      githubToken = (fullUser as { identities?: { identity_data?: { access_token?: string } }[] })?.identities?.[0]?.identity_data?.access_token || null
    }

    if (!githubToken) {
      return json(res, 400, { error: 'GitHub token not found. Please re-authenticate with GitHub.' })
    }

    await storeGitHubToken(user.id, githubToken)
    const snapshot = await collectGitHubData(githubToken)
    const supabase = getServiceSupabase()

    await supabase.from(TABLES.profiles).upsert({
      id: user.id,
      github_username: snapshot.profile.login,
      avatar_url: snapshot.profile.avatar_url,
      bio: snapshot.profile.bio,
      public_repos: snapshot.profile.public_repos,
      followers: snapshot.profile.followers,
      updated_at: new Date().toISOString(),
    })

    await supabase.from(TABLES.githubSnapshots).insert({
      user_id: user.id,
      raw_data: snapshot,
      synced_at: new Date().toISOString(),
    })

    return json(res, 200, { snapshot })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sync failed'
    return json(res, 500, { error: message })
  }
}
