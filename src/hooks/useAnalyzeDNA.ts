import { useQueryClient } from '@tanstack/react-query'
import { runAnalyzeDNA, isGitHubTokenError } from '@/lib/analyzeDNA'
import { useAnalysisStore } from '@/stores/analysisStore'

export { isGitHubTokenError }

export function useAnalyzeDNA() {
  const queryClient = useQueryClient()
  const isAnalyzing = useAnalysisStore((s) => s.isAnalyzing)
  const analyzeError = useAnalysisStore((s) => s.analyzeError)
  const setAnalyzeError = useAnalysisStore((s) => s.setAnalyzeError)

  return {
    analyze: () => {
      void runAnalyzeDNA(queryClient)
    },
    reset: () => setAnalyzeError(null),
    isLoading: isAnalyzing,
    error: analyzeError,
    needsReauth: analyzeError ? isGitHubTokenError(analyzeError) : false,
  }
}
