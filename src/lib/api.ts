import { supabase } from './supabase'
import type {
  AnalysisResult,
  CareerCoachMessage,
  LearningRoadmapItem,
  Profile,
  ResumeContent,
  UniversityMission,
  WeeklyReport,
} from '@/types/analysis'

async function getAuthHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) {
    throw new Error('Not authenticated')
  }
  return {
    Authorization: `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
  }
}

async function getProviderToken(): Promise<string | undefined> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.provider_token ?? undefined
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = await getAuthHeaders()
  const res = await fetch(path, {
    ...options,
    headers: { ...headers, ...options.headers },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    if (res.status === 404) {
      throw new Error('API 서버를 찾을 수 없습니다. Vercel 배포 설정을 확인해 주세요.')
    }
    throw new Error(err.error || 'API request failed')
  }
  return res.json()
}

export const api = {
  syncGitHub: async () => {
    const providerToken = await getProviderToken()
    return apiFetch<{ snapshot: unknown }>('/api/github/sync', {
      method: 'POST',
      body: JSON.stringify({ providerToken }),
    })
  },

  runAnalysis: () => apiFetch<{ analysis: AnalysisResult }>('/api/analysis/run', { method: 'POST' }),

  getAnalysis: () => apiFetch<{ analysis: AnalysisResult | null }>('/api/analysis/get'),

  getProfile: () => apiFetch<{ profile: Profile | null }>('/api/profile/get'),

  sendCareerCoachMessage: (message: string) =>
    apiFetch<{ reply: string; message: CareerCoachMessage }>('/api/career-coach/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),

  getCareerCoachMessages: () =>
    apiFetch<{ messages: CareerCoachMessage[] }>('/api/career-coach/messages'),

  generatePortfolio: () =>
    apiFetch<{ portfolio: unknown }>('/api/portfolio/generate', { method: 'POST' }),

  generateResume: (type: ResumeContent['type']) =>
    apiFetch<{ content: string }>('/api/resume/generate', {
      method: 'POST',
      body: JSON.stringify({ type }),
    }),

  matchJob: (jobDescription: string) =>
    apiFetch<{ match: unknown }>('/api/jobs/match', {
      method: 'POST',
      body: JSON.stringify({ jobDescription }),
    }),

  getRepoRecommendations: () =>
    apiFetch<{ repos: unknown[] }>('/api/repos/recommend'),

  getLearningRoadmap: () =>
    apiFetch<{ items: LearningRoadmapItem[] }>('/api/learning/roadmap'),

  getUniversityMissions: () =>
    apiFetch<{ missions: UniversityMission[] }>('/api/university/missions'),

  completeMission: (missionId: string) =>
    apiFetch<{ success: boolean }>('/api/university/complete', {
      method: 'POST',
      body: JSON.stringify({ missionId }),
    }),

  generateWeeklyReport: () =>
    apiFetch<{ report: WeeklyReport }>('/api/reports/weekly', { method: 'POST' }),

  getWeeklyReports: () =>
    apiFetch<{ reports: WeeklyReport[] }>('/api/reports/list'),
}
