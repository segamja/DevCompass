import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getUserFromRequest, getServiceSupabase, json, methodNotAllowed, unauthorized } from '../../lib/auth.js'
import { runAIAnalysis } from '../../lib/openai.js'
import { TABLES } from '../../lib/tables.js'
import type { GitHubSnapshot } from '../../../src/types/analysis.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return methodNotAllowed(res)

  const user = await getUserFromRequest(req)
  if (!user) return unauthorized(res)

  try {
    const supabase = getServiceSupabase()

    const { data: snapshotRow } = await supabase
      .from(TABLES.githubSnapshots)
      .select('raw_data')
      .eq('user_id', user.id)
      .order('synced_at', { ascending: false })
      .limit(1)
      .single()

    if (!snapshotRow?.raw_data) {
      return json(res, 400, { error: 'No GitHub data found. Please sync first.' })
    }

    const analysis = await runAIAnalysis(snapshotRow.raw_data as GitHubSnapshot)

    await supabase.from(TABLES.analysisResults).upsert({
      user_id: user.id,
      result: analysis,
      analyzed_at: new Date().toISOString(),
    })

    await supabase.from(TABLES.learningRoadmap).upsert({
      user_id: user.id,
      items: analysis.career_recommendations.map((r, i) => ({
        id: String(i + 1),
        title: r.title,
        priority: r.priority,
        progress: 0,
        estimated_hours: r.estimated_hours,
        modules: r.modules,
        description: r.description,
      })),
      updated_at: new Date().toISOString(),
    })

    await supabase.from(TABLES.repoRecommendations).upsert({
      user_id: user.id,
      repos: analysis.repo_recommendations,
      updated_at: new Date().toISOString(),
    })

    return json(res, 200, { analysis })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Analysis failed'
    return json(res, 500, { error: message })
  }
}
