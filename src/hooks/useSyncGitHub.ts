import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAnalysisStore } from '@/stores/analysisStore'

export function useSyncGitHub() {
  const queryClient = useQueryClient()
  const { setSyncing, setLastSyncedAt } = useAnalysisStore()

  const mutation = useMutation({
    mutationFn: () => api.syncGitHub(),
    onMutate: () => setSyncing(true),
    onSettled: () => setSyncing(false),
    onSuccess: () => {
      setLastSyncedAt(new Date().toISOString())
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })

  return {
    sync: mutation.mutate,
    isSyncing: mutation.isPending,
    error: mutation.error,
  }
}
