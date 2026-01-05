import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { api } from '../api'
import type { ApiError } from '../api.error'

type Options = UseMutationOptions<
  Awaited<ReturnType<typeof api.updateColumn>>,
  ApiError,
  {
    id: string
    title: string
  }
>

export function useUpdateColumnMutation(options?: Options) {
  return useMutation({
    mutationFn: (variables) => api.updateColumn(variables),
    ...options,
  })
}
