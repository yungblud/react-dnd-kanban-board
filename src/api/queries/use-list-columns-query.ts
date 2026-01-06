import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { api } from '../api'
import type { ApiError } from '../api.error'

type Options = UseQueryOptions<
  Awaited<ReturnType<typeof api.fetchColumns>>,
  ApiError
>

export function useListColumnsQuery(options?: Partial<Options>) {
  return useQuery({
    queryKey: queryKeys.column.list(),
    queryFn: () => api.fetchColumns(),
    ...options,
  })
}
