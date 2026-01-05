import type { Card } from '@/types'
import styled from '@emotion/styled'
import { overlay } from 'overlay-kit'
import { memo, useCallback } from 'react'
import { KanbanCardModal } from '../kanban-card-modal'
import { isBefore } from 'date-fns'

const Container = styled.div<{ $isExpired?: boolean }>`
  border-radius: 4px;
  border: ${(props) =>
    props.$isExpired ? '1px solid red' : '1px solid black'};

  padding: 12px 8px;
  cursor: pointer;
  width: 240px;
`

const Title = styled.p`
  margin: unset;
`

export const KanbanCard = memo((props: Card) => {
  const { title, dueDate } = props

  const now = new Date()
  const isExpired = dueDate ? isBefore(new Date(dueDate), now) : false

  const handleClick = useCallback(() => {
    const overlayId = overlay.open(
      ({ isOpen, overlayId }) =>
        isOpen && <KanbanCardModal {...props} overlayId={overlayId} />
    )

    return () => overlay.close(overlayId)
  }, [props])

  return (
    <Container onClick={handleClick} $isExpired={isExpired}>
      <Title>{title}</Title>
    </Container>
  )
})
