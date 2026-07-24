import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAnalysisStore } from '@/stores/analysisStore'
import { useAuthStore } from '@/stores/authStore'
import { useEffect } from 'react'
import { DEMO_ANALYSIS } from '@/lib/demo'

export function useAnalysis() {
  const { analysis, setAnalysis } = useAnalysisStore()
  const isDemo = useAuthStore((s) => s.isDemo)

  const query = useQuery({
    queryKey: ['analysis'],
    queryFn: async () => {
      if (isDemo) return DEMO_ANALYSIS
      const { analysis: data } = await api.getAnalysis()
      return data
    },
    staleTime: 5 * 60 * 1000,
    enabled: isDemo || !!useAuthStore.getState().session,
  })

  useEffect(() => {
    if (isDemo) {
      setAnalysis(DEMO_ANALYSIS)
      return
    }
    if (query.data) setAnalysis(query.data)
  }, [query.data, setAnalysis, isDemo])

  return { analysis: isDemo ? DEMO_ANALYSIS : (analysis ?? query.data), ...query }
}
