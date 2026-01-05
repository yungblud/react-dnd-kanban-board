import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { api } from '../api'
import type { ApiError } from '../api.error'

type Options = UseMutationOptions<
  Awaited<ReturnType<typeof api.removeCard>>,
  ApiError,
  Parameters<typeof api.removeCard>[0]
>

export function useRemoveCardMutation(options?: Options) {
  return useMutation({
    mutationFn: (variables) => api.removeCard(variables),
    ...options,
  })
}
