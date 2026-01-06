import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { api } from '../api'
import type { ApiError } from '../api.error'

type Options = UseMutationOptions<
  Awaited<ReturnType<typeof api.createCard>>,
  ApiError,
  Parameters<typeof api.createCard>[0]
>

export function useCreateCardMutation(options?: Partial<Options>) {
  return useMutation({
    mutationFn: (variables) => api.createCard(variables),
    ...options,
  })
}
