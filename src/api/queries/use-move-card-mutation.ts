import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { api } from '../api'
import type { ApiError } from '../api.error'

type Options = UseMutationOptions<
  Awaited<ReturnType<typeof api.moveCard>>,
  ApiError,
  Parameters<typeof api.moveCard>[0]
>

export function useMoveCardMutation(options?: Partial<Options>) {
  return useMutation({
    mutationFn: (variables) => api.moveCard(variables),
    ...options,
  })
}
