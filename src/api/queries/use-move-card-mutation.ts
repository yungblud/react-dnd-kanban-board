import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { api } from '../api'
import type { ApiError } from '../api.error'
import type { ColumnWithCard, HttpResponse } from '@/types'

type Options = UseMutationOptions<
  Awaited<ReturnType<typeof api.moveCard>>,
  ApiError,
  Parameters<typeof api.moveCard>[0],
  {
    newData?: HttpResponse<ColumnWithCard[]>
    prevData?: HttpResponse<ColumnWithCard[]>
  }
>

export function useMoveCardMutation(options?: Partial<Options>) {
  return useMutation({
    mutationFn: (variables) => api.moveCard(variables),
    ...options,
  })
}
