import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { api } from '../api'
import type { ApiError } from '../api.error'

type Options = UseMutationOptions<
  Awaited<ReturnType<typeof api.updateCard>>,
  ApiError,
  Parameters<typeof api.updateCard>[0]
>

export function useUpdateCardMutation(options?: Options) {
  return useMutation({
    mutationFn: (variables) => api.updateCard(variables),
    ...options,
  })
}
