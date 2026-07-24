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
  'github/sync': () => import('../server/routes/github/sync.js'),
  'analysis/run': () => import('../server/routes/analysis/run.js'),
  'analysis/get': () => import('../server/routes/analysis/get.js'),
  'profile/get': () => import('../server/routes/profile/get.js'),
  'career-coach/chat': () => import('../server/routes/career-coach/chat.js'),
  'career-coach/messages': () => import('../server/routes/career-coach/messages.js'),
  'portfolio/generate': () => import('../server/routes/portfolio/generate.js'),
  'resume/generate': () => import('../server/routes/resume/generate.js'),
  'jobs/match': () => import('../server/routes/jobs/match.js'),
  'repos/recommend': () => import('../server/routes/repos/recommend.js'),
  'learning/roadmap': () => import('../server/routes/learning/roadmap.js'),
  'university/missions': () => import('../server/routes/university/missions.js'),
  'university/complete': () => import('../server/routes/university/complete.js'),
  'reports/weekly': () => import('../server/routes/reports/weekly.js'),
  'reports/list': () => import('../server/routes/reports/list.js'),
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
