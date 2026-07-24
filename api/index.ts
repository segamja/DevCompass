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
  'github/sync': () => import('./routes/github/sync.js'),
  'analysis/run': () => import('./routes/analysis/run.js'),
  'analysis/get': () => import('./routes/analysis/get.js'),
  'profile/get': () => import('./routes/profile/get.js'),
  'career-coach/chat': () => import('./routes/career-coach/chat.js'),
  'career-coach/messages': () => import('./routes/career-coach/messages.js'),
  'portfolio/generate': () => import('./routes/portfolio/generate.js'),
  'resume/generate': () => import('./routes/resume/generate.js'),
  'jobs/match': () => import('./routes/jobs/match.js'),
  'repos/recommend': () => import('./routes/repos/recommend.js'),
  'learning/roadmap': () => import('./routes/learning/roadmap.js'),
  'university/missions': () => import('./routes/university/missions.js'),
  'university/complete': () => import('./routes/university/complete.js'),
  'reports/weekly': () => import('./routes/reports/weekly.js'),
  'reports/list': () => import('./routes/reports/list.js'),
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
