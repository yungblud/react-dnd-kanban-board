import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { api } from '../api'
import type { ApiError } from '../api.error'
import type { ColumnWithCard, HttpResponse } from '@/types'

type Options = UseMutationOptions<
  Awaited<ReturnType<typeof api.updateCard>>,
  ApiError,
  Parameters<typeof api.updateCard>[0],
  {
    prevData?: HttpResponse<ColumnWithCard[]>
    newData?: HttpResponse<ColumnWithCard[]>
  }
>

export function useUpdateCardMutation(options?: Partial<Options>) {
  return useMutation({
    mutationFn: (variables) => api.updateCard(variables),
    ...options,
  })
}
