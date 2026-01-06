import { memo, useCallback } from 'react'
import type { WithOverlayId } from '../modal/modal.types'
import { Modal } from '../modal'
import { Button } from '../button'
import { queryKeys, useRemoveColumnMutation } from '@/api/queries'
import { useQueryClient } from '@tanstack/react-query'
import { overlay } from 'overlay-kit'
import type { ColumnWithCard, HttpResponse } from '@/types'

const confirmDescription =
  '컬럼 삭제 시 해당 컬럼의 모든 카드도 함께 삭제됩니다.'

export const RemoveColumnConfirmModal = memo(
  ({ overlayId, columnId }: WithOverlayId<{ columnId: string }>) => {
    const queryClient = useQueryClient()
    const { mutate: removeColumn, isPending: isPendingRemoveColumn } =
      useRemoveColumnMutation({
        onMutate: async (variables) => {
          await queryClient.cancelQueries({
            queryKey: queryKeys.column.list(),
          })
          const prevData = queryClient.getQueryData<
            HttpResponse<ColumnWithCard[]>
          >(queryKeys.column.list())

          const newData: HttpResponse<ColumnWithCard[]> | undefined = prevData
            ? {
                ...prevData,
                data: prevData.data.filter(
                  (value) => value.id !== variables.id
                ),
              }
            : undefined

          queryClient.setQueryData(queryKeys.column.list(), newData)

          return {
            newData,
            prevData,
          }
        },
        onError: (error, variables, ctx) => {
          if (ctx?.prevData) {
            queryClient.setQueryData(queryKeys.column.list(), ctx.prevData)
          }
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: queryKeys.column.list(),
          })
        },
      })

    const onClickConfirm = useCallback(() => {
      if (isPendingRemoveColumn) return
      removeColumn({
        id: columnId,
      })
      if (overlayId) {
        overlay.close(overlayId)
      }
    }, [columnId, isPendingRemoveColumn, overlayId, removeColumn])

    return (
      <Modal overlayId={overlayId}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <p style={{ marginBottom: '1rem' }}>{confirmDescription}</p>
          <Button onClick={onClickConfirm} style={{ marginLeft: 'auto' }}>
            확인
          </Button>
        </div>
      </Modal>
    )
  }
)
