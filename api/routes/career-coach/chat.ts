import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getUserFromRequest, getServiceSupabase, json, methodNotAllowed, unauthorized } from '../../lib/auth'
import { runCareerCoachChat } from '../../lib/openai'
import { TABLES } from '../../lib/tables'
import type { AnalysisResult } from '../../../src/types/analysis'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return methodNotAllowed(res)

  const user = await getUserFromRequest(req)
  if (!user) return unauthorized(res)

  const { message } = req.body as { message?: string }
  if (!message?.trim()) return json(res, 400, { error: 'Message is required' })

  try {
    const supabase = getServiceSupabase()

    const { data: analysisRow } = await supabase
      .from(TABLES.analysisResults)
      .select('result')
      .eq('user_id', user.id)
      .single()

    const { data: history } = await supabase
      .from(TABLES.careerCoachMessages)
      .select('role, content')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(20)

    await supabase.from(TABLES.careerCoachMessages).insert({
      user_id: user.id,
      role: 'user',
      content: message,
    })

    const reply = await runCareerCoachChat(
      message,
      analysisRow?.result as AnalysisResult | null,
      history || [],
    )

    const { data: assistantMsg, error: insertError } = await supabase
      .from(TABLES.careerCoachMessages)
      .insert({ user_id: user.id, role: 'assistant', content: reply })
      .select()
      .single()

    if (insertError) {
      console.error('Failed to save assistant message:', insertError)
    }

    return json(res, 200, {
      reply,
      message: assistantMsg ?? { id: crypto.randomUUID(), role: 'assistant', content: reply, created_at: new Date().toISOString() },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Chat failed'
    return json(res, 500, { error: msg })
  }
}
