import { queryKeys, useRemoveCardMutation } from '@/api/queries'
import { Button } from '../button'
import { Modal } from '../modal'
import type { WithOverlayId } from '../modal/modal.types'
import { useQueryClient } from '@tanstack/react-query'
import styled from '@emotion/styled'
import { overlay } from 'overlay-kit'
import type { ColumnWithCard, HttpResponse } from '@/types'

const Inner = styled.div`
  display: flex;
  flex-direction: column;
`

export const KanbanCardRemoveModal = ({
  overlayId,
  id,
}: WithOverlayId<{ id: string }>) => {
  const queryClient = useQueryClient()
  const { mutate: removeCard, isPending: isPendingRemoveCard } =
    useRemoveCardMutation({
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
              data: prevData.data.map((value) => {
                return {
                  ...value,
                  cards: value.cards.filter((card) => card.id !== variables.id),
                }
              }),
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
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.column.list(),
        })
      },
    })
  return (
    <Modal overlayId={overlayId}>
      <Inner>
        <p>삭제하시겠습니까?</p>
        <Button
          onClick={() => {
            if (isPendingRemoveCard) return
            removeCard({
              id,
            })
            overlay.closeAll()
          }}
          style={{ marginLeft: 'auto' }}
        >
          네
        </Button>
      </Inner>
    </Modal>
  )
}
