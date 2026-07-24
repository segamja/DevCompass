import type { VercelRequest, VercelResponse } from '@vercel/node'
import { readFileSync } from 'fs'
import { join } from 'path'

type RouteHandler = (req: VercelRequest, res: VercelResponse) => Promise<unknown>

function getAppVersion(): string {
  try {
    const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8')) as { version?: string }
    return pkg.version ?? 'unknown'
  } catch {
    return 'unknown'
  }
}

const routes: Record<string, () => Promise<{ default: RouteHandler }>> = {
  'github/sync': () => import('./routes/github/sync'),
  'analysis/run': () => import('./routes/analysis/run'),
  'analysis/get': () => import('./routes/analysis/get'),
  'profile/get': () => import('./routes/profile/get'),
  'career-coach/chat': () => import('./routes/career-coach/chat'),
  'career-coach/messages': () => import('./routes/career-coach/messages'),
  'portfolio/generate': () => import('./routes/portfolio/generate'),
  'resume/generate': () => import('./routes/resume/generate'),
  'jobs/match': () => import('./routes/jobs/match'),
  'repos/recommend': () => import('./routes/repos/recommend'),
  'learning/roadmap': () => import('./routes/learning/roadmap'),
  'university/missions': () => import('./routes/university/missions'),
  'university/complete': () => import('./routes/university/complete'),
  'reports/weekly': () => import('./routes/reports/weekly'),
  'reports/list': () => import('./routes/reports/list'),
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
    return res.status(200).json({
      ok: true,
      service: 'devcompass-api',
      version: getAppVersion(),
    })
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
