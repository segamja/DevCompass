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
  '/api/github/sync': () => import('./routes/github/sync'),
  '/api/analysis/run': () => import('./routes/analysis/run'),
  '/api/analysis/get': () => import('./routes/analysis/get'),
  '/api/profile/get': () => import('./routes/profile/get'),
  '/api/career-coach/chat': () => import('./routes/career-coach/chat'),
  '/api/career-coach/messages': () => import('./routes/career-coach/messages'),
  '/api/portfolio/generate': () => import('./routes/portfolio/generate'),
  '/api/resume/generate': () => import('./routes/resume/generate'),
  '/api/jobs/match': () => import('./routes/jobs/match'),
  '/api/repos/recommend': () => import('./routes/repos/recommend'),
  '/api/learning/roadmap': () => import('./routes/learning/roadmap'),
  '/api/university/missions': () => import('./routes/university/missions'),
  '/api/university/complete': () => import('./routes/university/complete'),
  '/api/reports/weekly': () => import('./routes/reports/weekly'),
  '/api/reports/list': () => import('./routes/reports/list'),
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
