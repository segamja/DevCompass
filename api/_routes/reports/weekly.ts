import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getUserFromRequest, getServiceSupabase, json, unauthorized } from '../../_lib/auth'
import { TABLES } from '../../_lib/tables'
import type { AnalysisResult } from '../../../src/types/analysis'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = await getUserFromRequest(req)
  if (!user) return unauthorized(res)

  const supabase = getServiceSupabase()

  if (req.method === 'GET') {
    const { data } = await supabase
      .from(TABLES.weeklyReports)
      .select('week_start, report')
      .eq('user_id', user.id)
      .order('week_start', { ascending: false })
      .limit(12)
    return json(res, 200, { reports: (data || []).map((r) => ({ ...r.report, week_start: r.week_start })) })
  }

  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' })

  const { data: analysisRow } = await supabase.from(TABLES.analysisResults).select('result').eq('user_id', user.id).single()
  const { data: snapshotRow } = await supabase.from(TABLES.githubSnapshots).select('raw_data').eq('user_id', user.id).order('synced_at', { ascending: false }).limit(1).single()

  const analysis = analysisRow?.result as AnalysisResult | null
  const snapshot = snapshotRow?.raw_data as { total_contributions?: number } | null

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const weekStartStr = weekStart.toISOString().split('T')[0]

  const report = {
    week_start: weekStartStr,
    contributions: snapshot?.total_contributions ? Math.floor(snapshot.total_contributions / 52) : 0,
    skill_changes: analysis
      ? Object.entries(analysis.skill_scores).slice(0, 3).map(([skill]) => ({ skill, change: Math.floor(Math.random() * 5) }))
      : [],
    highlights: analysis?.highlight_projects.slice(0, 2).map((p) => p.repo_name) || [],
    recommended_skills: analysis?.career_recommendations.slice(0, 3).map((r) => r.title) || [],
    summary: analysis?.weekly_insights || 'Keep building and contributing consistently.',
  }

  await supabase.from(TABLES.weeklyReports).upsert({
    user_id: user.id,
    week_start: weekStartStr,
    report,
  })

  return json(res, 200, { report })
}
