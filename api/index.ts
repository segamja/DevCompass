import type { VercelRequest, VercelResponse } from '@vercel/node'

type RouteHandler = (req: VercelRequest, res: VercelResponse) => Promise<unknown>

const routes: Record<string, () => Promise<{ default: RouteHandler }>> = {
  'github/sync': () => import('./_routes/github/sync'),
  'analysis/run': () => import('./_routes/analysis/run'),
  'analysis/get': () => import('./_routes/analysis/get'),
  'profile/get': () => import('./_routes/profile/get'),
  'career-coach/chat': () => import('./_routes/career-coach/chat'),
  'career-coach/messages': () => import('./_routes/career-coach/messages'),
  'portfolio/generate': () => import('./_routes/portfolio/generate'),
  'resume/generate': () => import('./_routes/resume/generate'),
  'jobs/match': () => import('./_routes/jobs/match'),
  'repos/recommend': () => import('./_routes/repos/recommend'),
  'learning/roadmap': () => import('./_routes/learning/roadmap'),
  'university/missions': () => import('./_routes/university/missions'),
  'university/complete': () => import('./_routes/university/complete'),
  'reports/weekly': () => import('./_routes/reports/weekly'),
  'reports/list': () => import('./_routes/reports/list'),
}

function getRouteKey(req: VercelRequest): string {
  const route = req.query.route
  if (route) {
    return Array.isArray(route) ? route.join('/') : route
  }

  const path = req.query.path
  if (path) {
    return Array.isArray(path) ? path.join('/') : path
  }

  const url = req.url || ''
  const match = url.match(/\/api\/([^?]+)/)
  return match?.[1] || ''
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  const routeKey = getRouteKey(req)

  if (routeKey === 'health') {
    return res.status(200).json({ ok: true, service: 'devcompass-api' })
  }

  const loader = routes[routeKey]
  if (!loader) {
    return res.status(404).json({ error: `Route not found: ${routeKey || '(empty)'}` })
  }

  try {
    const mod = await loader()
    return mod.default(req, res)
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' })
  }
}

export const config = {
  maxDuration: 60,
}
