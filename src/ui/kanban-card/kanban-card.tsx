import type { Card } from '@/types'
import styled from '@emotion/styled'
import { overlay } from 'overlay-kit'
import { memo, useCallback } from 'react'
import { KanbanCardModal } from '../kanban-card-modal'
import { isBefore } from 'date-fns'
import { motion } from 'framer-motion'

const motionDiv = motion.div

const Container = styled(motionDiv)<{ $isExpired?: boolean }>`
  border-radius: 12px;
  border: ${(props) =>
    props.$isExpired ? '1px solid red' : '1px solid black'};

  padding: 12px 12px;
  cursor: pointer;
  width: 240px;

  margin-top: 0.5rem;
`

const Title = styled.p`
  margin: unset;
  font-size: 0.875rem;
  font-weight: 550;
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
    <Container
      initial={{
        background: '#FFF',
      }}
      whileHover={{
        background: 'rgb(242, 243, 247)',
      }}
      onClick={handleClick}
      $isExpired={isExpired}
    >
      <Title>{title}</Title>
    </Container>
  )
})
