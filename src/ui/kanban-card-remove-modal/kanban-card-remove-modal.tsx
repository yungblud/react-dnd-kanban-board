import { queryKeys, useRemoveCardMutation } from '@/api/queries'
import { Button } from '../button'
import { Modal } from '../modal'
import type { WithOverlayId } from '../modal/modal.types'
import { useQueryClient } from '@tanstack/react-query'
import styled from '@emotion/styled'
import { overlay } from 'overlay-kit'

const Inner = styled.div`
  display: flex;
  flex-direction: column;
`

export const KanbanCardRemoveModal = ({
  overlayId,
  id,
}: WithOverlayId<{ id: string }>) => {
  const queryClient = useQueryClient()
  // @TODO: implement optimistic update
  const { mutate: removeCard, isPending: isPendingRemoveCard } =
    useRemoveCardMutation({
      onSuccess: () => {
        console.log('success')
        queryClient.invalidateQueries({
          queryKey: queryKeys.column.list(),
        })
        overlay.closeAll()
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
          }}
          style={{ marginLeft: 'auto' }}
        >
          네
        </Button>
      </Inner>
    </Modal>
  )
}
