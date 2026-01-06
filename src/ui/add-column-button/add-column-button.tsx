import { queryKeys, useCreateColumnMutation } from '@/api/queries'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '../button'
import { useCallback } from 'react'

export const AddColumnButton = () => {
  const queryClient = useQueryClient()
  // @TODO: implement optimistic update
  const { mutate: createColumn, isPending: isPendingCreateColumn } =
    useCreateColumnMutation({
      onSuccess: () => {
        console.log('success')
        queryClient.invalidateQueries({
          queryKey: queryKeys.column.list(),
        })
      },
    })

  const handleClick = useCallback(() => {
    if (isPendingCreateColumn) return
    createColumn({ title: 'Mock Title' })
  }, [createColumn, isPendingCreateColumn])

  return <Button onClick={handleClick}>컬럼 추가</Button>
}
