import { createServer } from 'http'
import type { IncomingMessage, ServerResponse } from 'http'
import { URL } from 'url'
import path from 'path'
import { fileURLToPath } from 'url'
import { loadEnv } from 'vite'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
Object.assign(process.env, loadEnv('development', root, ''))

type Handler = (req: VercelRequest, res: VercelResponse) => Promise<unknown>

const routes: Record<string, () => Promise<{ default: Handler }>> = {
  '/api/github/sync': () => import('../api/routes/github/sync'),
  '/api/analysis/run': () => import('../api/routes/analysis/run'),
  '/api/analysis/get': () => import('../api/routes/analysis/get'),
  '/api/profile/get': () => import('../api/routes/profile/get'),
  '/api/career-coach/chat': () => import('../api/routes/career-coach/chat'),
  '/api/career-coach/messages': () => import('../api/routes/career-coach/messages'),
  '/api/portfolio/generate': () => import('../api/routes/portfolio/generate'),
  '/api/resume/generate': () => import('../api/routes/resume/generate'),
  '/api/jobs/match': () => import('../api/routes/jobs/match'),
  '/api/repos/recommend': () => import('../api/routes/repos/recommend'),
  '/api/learning/roadmap': () => import('../api/routes/learning/roadmap'),
  '/api/university/missions': () => import('../api/routes/university/missions'),
  '/api/university/complete': () => import('../api/routes/university/complete'),
  '/api/reports/weekly': () => import('../api/routes/reports/weekly'),
  '/api/reports/list': () => import('../api/routes/reports/list'),
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks).toString()))
  })
}

function createVercelRes(res: ServerResponse) {
  return {
    status(code: number) {
      res.statusCode = code
      return this
    },
    json(data: unknown) {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(data))
    },
  }
}

const server = createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')
  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  const url = new URL(req.url || '/', `http://localhost:3001`)
  const pathname = url.pathname.replace(/\/$/, '') || '/'
  const loader = routes[pathname]

  if (!loader) {
    res.statusCode = 404
    res.end(JSON.stringify({ error: 'Not found' }))
    return
  }

  try {
    const mod = await loader()
    const bodyStr = req.method === 'POST' ? await readBody(req) : ''
    const vercelReq = Object.assign(req, {
      method: req.method,
      headers: req.headers as Record<string, string>,
      body: bodyStr ? JSON.parse(bodyStr) : {},
      query: Object.fromEntries(url.searchParams),
    })
    await mod.default(vercelReq as VercelRequest, createVercelRes(res) as unknown as VercelResponse)
  } catch (err) {
    res.statusCode = 500
    res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Server error' }))
  }
})

server.listen(3001, () => {
  console.log('DevCompass API server running on http://localhost:3001')
})
