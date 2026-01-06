import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { api } from '../api'
import type { ApiError } from '../api.error'
import type { ColumnWithCard, HttpResponse } from '@/types'

type Options = UseMutationOptions<
  Awaited<ReturnType<typeof api.removeCard>>,
  ApiError,
  Parameters<typeof api.removeCard>[0],
  {
    newData?: HttpResponse<ColumnWithCard[]>
    prevData?: HttpResponse<ColumnWithCard[]>
  }
>

export function useRemoveCardMutation(options?: Partial<Options>) {
  return useMutation({
    mutationFn: (variables) => api.removeCard(variables),
    ...options,
  })
}
