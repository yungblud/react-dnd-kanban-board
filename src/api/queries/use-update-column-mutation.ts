import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { api } from '../api'
import type { ApiError } from '../api.error'
import type { ColumnWithCard, HttpResponse } from '@/types'

type Options = UseMutationOptions<
  Awaited<ReturnType<typeof api.updateColumn>>,
  ApiError,
  {
    id: string
    title: string
  },
  {
    prevData?: HttpResponse<ColumnWithCard[]>
    newData?: HttpResponse<ColumnWithCard[]>
  }
>

export function useUpdateColumnMutation(options?: Options) {
  return useMutation({
    mutationFn: (variables) => api.updateColumn(variables),
    ...options,
  })
}
