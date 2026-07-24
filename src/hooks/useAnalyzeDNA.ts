import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAnalysisStore } from '@/stores/analysisStore'
import { useAuthStore } from '@/stores/authStore'
import { DEMO_ANALYSIS } from '@/lib/demo'

export function useAnalyzeDNA() {
  const queryClient = useQueryClient()
  const { setAnalyzing, setAnalysis } = useAnalysisStore()
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
    onMutate: () => setAnalyzing(true),
    onSettled: () => setAnalyzing(false),
    onSuccess: (analysis) => {
      setAnalysis(analysis)
      queryClient.invalidateQueries({ queryKey: ['analysis'] })
      queryClient.invalidateQueries({ queryKey: ['learning-roadmap'] })
      queryClient.invalidateQueries({ queryKey: ['repo-recommendations'] })
    },
  })

  return {
    analyze: () => mutation.mutateAsync(),
    isLoading: mutation.isPending,
    error: mutation.error,
  }
}
