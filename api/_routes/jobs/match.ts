import type { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'
import { getUserFromRequest, getServiceSupabase, json, methodNotAllowed, unauthorized } from '../../_lib/auth'
import { TABLES } from '../../_lib/tables'
import type { AnalysisResult } from '../../../src/types/analysis'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return methodNotAllowed(res)

  const user = await getUserFromRequest(req)
  if (!user) return unauthorized(res)

  const { jobDescription } = req.body as { jobDescription?: string }
  if (!jobDescription?.trim()) return json(res, 400, { error: 'Job description is required' })

  const supabase = getServiceSupabase()
  const { data: analysisRow } = await supabase.from(TABLES.analysisResults).select('result').eq('user_id', user.id).single()
  const analysis = analysisRow?.result as AnalysisResult | null

  let match = {
    job_title: 'Target Role',
    match_score: 65,
    gaps: [
      { skill: 'Core Skills', status: 'MATCHED' as const, description: 'Partial match based on profile' },
      { skill: 'Advanced Requirements', status: 'HIGH_GAP' as const, description: 'Some requirements not visible in GitHub activity' },
    ],
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (apiKey && analysis) {
    const openai = new OpenAI({ apiKey })
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Analyze job fit. Return JSON: { job_title, match_score (0-100), gaps: [{ skill, status: MATCHED|HIGH_GAP|MEDIUM_GAP, description }] }',
        },
        { role: 'user', content: `Job:\n${jobDescription}\n\nDeveloper:\n${JSON.stringify(analysis)}` },
      ],
      response_format: { type: 'json_object' },
    })
    try {
      match = JSON.parse(response.choices[0]?.message?.content || '{}')
    } catch { /* use default */ }
  }

  await supabase.from(TABLES.jobMatches).insert({
    user_id: user.id,
    job_title: match.job_title,
    match_score: match.match_score,
    gaps: match.gaps,
    job_description: jobDescription,
    created_at: new Date().toISOString(),
  })

  return json(res, 200, { match })
}
