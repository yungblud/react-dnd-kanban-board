import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { api } from '../api'
import type { ApiError } from '../api.error'

type Options = UseMutationOptions<
  Awaited<ReturnType<typeof api.removeColumn>>,
  ApiError,
  {
    id: string
  }
>

export function useRemoveColumnMutation(options?: Options) {
  return useMutation({
    mutationFn: (variables) => api.removeColumn(variables),
    ...options,
  })
}
