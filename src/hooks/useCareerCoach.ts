import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function useCareerCoach() {
  const queryClient = useQueryClient()

  const messagesQuery = useQuery({
    queryKey: ['career-coach-messages'],
    queryFn: () => api.getCareerCoachMessages().then((r) => r.messages),
    staleTime: 60 * 1000,
  })

  const sendMutation = useMutation({
    mutationFn: (message: string) => api.sendCareerCoachMessage(message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['career-coach-messages'] })
    },
  })

  return {
    messages: messagesQuery.data ?? [],
    isLoading: messagesQuery.isLoading,
    sendMessage: sendMutation.mutateAsync,
    isSending: sendMutation.isPending,
  }
}
