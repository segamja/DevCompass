import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAnalysisStore } from '@/stores/analysisStore'
import { useAuthStore } from '@/stores/authStore'
import { DEMO_ANALYSIS } from '@/lib/demo'

export function isGitHubTokenError(message: string): boolean {
  return /github token|re-authenticate|provider token/i.test(message)
}

export function useAnalyzeDNA() {
  const queryClient = useQueryClient()
  const isAnalyzing = useAnalysisStore((s) => s.isAnalyzing)
  const analyzeError = useAnalysisStore((s) => s.analyzeError)
  const { setAnalyzing, setAnalysis, setAnalyzeError } = useAnalysisStore()
  const isDemo = useAuthStore((s) => s.isDemo)

  const mutation = useMutation({
    mutationFn: async () => {
      if (isDemo) {
        await new Promise((r) => setTimeout(r, 800))
        return DEMO_ANALYSIS
      }
      await api.syncGitHub()
      const { analysis } = await api.runAnalysis()
      return analysis
    },
    onMutate: () => {
      setAnalyzeError(null)
      setAnalyzing(true)
    },
    onSettled: () => setAnalyzing(false),
    onSuccess: (analysis) => {
      setAnalysis(analysis)
      queryClient.invalidateQueries({ queryKey: ['analysis'] })
      queryClient.invalidateQueries({ queryKey: ['learning-roadmap'] })
      queryClient.invalidateQueries({ queryKey: ['repo-recommendations'] })
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Analysis failed'
      setAnalyzeError(message)
    },
  })

  return {
    analyze: () => mutation.mutate(),
    reset: () => {
      mutation.reset()
      setAnalyzeError(null)
    },
    isLoading: isAnalyzing,
    error: analyzeError,
    needsReauth: analyzeError ? isGitHubTokenError(analyzeError) : false,
  }
}
