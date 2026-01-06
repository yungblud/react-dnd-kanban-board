import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { api } from '../api'
import type { ApiError } from '../api.error'
import type { ColumnWithCard, HttpResponse } from '@/types'

type Options = UseMutationOptions<
  Awaited<ReturnType<typeof api.createColumn>>,
  ApiError,
  { title: string },
  {
    prevData?: HttpResponse<ColumnWithCard[]>
    newData?: HttpResponse<ColumnWithCard[]>
  }
>

export function useCreateColumnMutation(options?: Partial<Options>) {
  return useMutation({
    mutationFn: (variables) => api.createColumn(variables),
    ...options,
  })
}
