import type { QueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { DEMO_ANALYSIS } from '@/lib/demo'
import { useAnalysisStore } from '@/stores/analysisStore'
import { useAuthStore } from '@/stores/authStore'
import type { AnalysisResult } from '@/types/analysis'

export function isGitHubTokenError(message: string): boolean {
  return /github token|re-authenticate|provider token/i.test(message)
}

let analyzePromise: Promise<AnalysisResult | undefined> | null = null

export async function runAnalyzeDNA(queryClient?: QueryClient): Promise<AnalysisResult | undefined> {
  if (analyzePromise) return analyzePromise

  const { setAnalyzing, setAnalysis, setAnalyzeError } = useAnalysisStore.getState()
  const isDemo = useAuthStore.getState().isDemo

  analyzePromise = (async () => {
    setAnalyzeError(null)
    setAnalyzing(true)

    try {
      let analysis: AnalysisResult

      if (isDemo) {
        await new Promise((r) => setTimeout(r, 800))
        analysis = DEMO_ANALYSIS
      } else {
        await api.syncGitHub()
        const result = await api.runAnalysis()
        analysis = result.analysis
      }

      setAnalysis(analysis)
      await queryClient?.invalidateQueries({ queryKey: ['analysis'] })
      await queryClient?.invalidateQueries({ queryKey: ['learning-roadmap'] })
      await queryClient?.invalidateQueries({ queryKey: ['repo-recommendations'] })
      return analysis
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analysis failed'
      setAnalyzeError(message)
      return undefined
    } finally {
      setAnalyzing(false)
      analyzePromise = null
    }
  })()

  return analyzePromise
}
