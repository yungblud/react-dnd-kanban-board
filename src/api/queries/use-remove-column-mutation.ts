import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { api } from '../api'
import type { ApiError } from '../api.error'
import type { ColumnWithCard, HttpResponse } from '@/types'

type Options = UseMutationOptions<
  Awaited<ReturnType<typeof api.removeColumn>>,
  ApiError,
  {
    id: string
  },
  {
    prevData?: HttpResponse<ColumnWithCard[]>
    newData?: HttpResponse<ColumnWithCard[]>
  }
>

export function useRemoveColumnMutation(options?: Options) {
  return useMutation({
    mutationFn: (variables) => api.removeColumn(variables),
    ...options,
  })
}
