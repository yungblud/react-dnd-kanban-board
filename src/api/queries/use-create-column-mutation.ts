import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { api } from '../api'
import type { ApiError } from '../api.error'

type Options = UseMutationOptions<
  Awaited<ReturnType<typeof api.createColumn>>,
  ApiError,
  { title: string }
>

export function useCreateColumnMutation(options?: Options) {
  return useMutation({
    mutationFn: (variables) => api.createColumn(variables),
    ...options,
  })
}
