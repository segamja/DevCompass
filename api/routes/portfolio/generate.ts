import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getUserFromRequest, getServiceSupabase, json, methodNotAllowed, unauthorized } from '../../lib/auth.js'
import { TABLES } from '../../lib/tables.js'
import type { AnalysisResult } from '../../../src/types/analysis.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return methodNotAllowed(res)

  const user = await getUserFromRequest(req)
  if (!user) return unauthorized(res)

  const supabase = getServiceSupabase()
  const { data } = await supabase
    .from(TABLES.analysisResults)
    .select('result')
    .eq('user_id', user.id)
    .single()

  const analysis = data?.result as AnalysisResult | null
  if (!analysis) return json(res, 400, { error: 'Run analysis first' })

  const portfolio = {
    developer_slogan: analysis.developer_slogan,
    career_story: analysis.career_story,
    tech_stack: analysis.tech_stack,
    highlight_projects: analysis.highlight_projects,
    developer_dna: analysis.developer_dna,
    skill_scores: analysis.skill_scores,
  }

  await supabase.from(TABLES.portfolios).upsert({
    user_id: user.id,
    content: portfolio,
    format: 'web',
    updated_at: new Date().toISOString(),
  })

  return json(res, 200, { portfolio })
}
