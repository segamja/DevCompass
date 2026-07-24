import type { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'
import { getUserFromRequest, getServiceSupabase, json, methodNotAllowed, unauthorized } from '../_lib/auth'
import { TABLES } from '../_lib/tables'
import type { AnalysisResult } from '../../src/types/analysis'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return methodNotAllowed(res)

  const user = await getUserFromRequest(req)
  if (!user) return unauthorized(res)

  const { type } = req.body as { type?: 'resume' | 'cover' | 'linkedin' }
  if (!type) return json(res, 400, { error: 'Type is required' })

  const supabase = getServiceSupabase()
  const { data: profile } = await supabase.from(TABLES.profiles).select('*').eq('id', user.id).single()
  const { data: analysisRow } = await supabase.from(TABLES.analysisResults).select('result').eq('user_id', user.id).single()
  const analysis = analysisRow?.result as AnalysisResult | null

  const prompts = {
    resume: 'Write a professional developer resume in markdown format.',
    cover: 'Write a compelling cover letter for a software engineering role.',
    linkedin: 'Write an optimized LinkedIn profile summary and headline.',
  }

  let content = `# ${profile?.github_username || 'Developer'}\n\n${analysis?.career_story || 'Experienced software developer.'}\n\n## Skills\n${analysis?.tech_stack.primary.join(', ') || 'Various technologies'}`

  const apiKey = process.env.OPENAI_API_KEY
  if (apiKey && analysis) {
    const openai = new OpenAI({ apiKey })
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: prompts[type] },
        { role: 'user', content: JSON.stringify({ profile, analysis }) },
      ],
      max_tokens: 1500,
    })
    content = response.choices[0]?.message?.content || content
  }

  await supabase.from(TABLES.resumes).upsert({
    user_id: user.id,
    type,
    content: { type, content },
    updated_at: new Date().toISOString(),
  })

  return json(res, 200, { content })
}
