import type { Card } from '@/types'
import styled from '@emotion/styled'
import { overlay } from 'overlay-kit'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { KanbanCardModal } from '../kanban-card-modal'
import { isBefore } from 'date-fns'
import { motion } from 'framer-motion'

const motionDiv = motion.div

const DRAG_THRESHOLD = 6 // px

type DragState = {
  cardId: string
  fromColumnId: string
  pointerX: number
  pointerY: number
  offsetX: number
  offsetY: number
  visible: boolean
} | null

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
  const { title, dueDate, id, columnId } = props

  const dragStartPointRef = useRef<{ x: number; y: number } | null>(null)

  const [dragState, setDragState] = useState<DragState>(null)

  const now = new Date()
  const isExpired = dueDate ? isBefore(new Date(dueDate), now) : false

  const handleClick = useCallback(() => {
    const overlayId = overlay.open(
      ({ isOpen, overlayId }) =>
        isOpen && <KanbanCardModal {...props} overlayId={overlayId} />
    )

    return () => overlay.close(overlayId)
  }, [props])

  useEffect(() => {
    if (!dragState) return
    const onPointerMove = (e: PointerEvent) => {
      if (!dragStartPointRef.current) return

      const dx = e.clientX - dragStartPointRef.current.x
      const dy = e.clientY - dragStartPointRef.current.y

      if (Math.sqrt(dx * dx + dy * dy) <= DRAG_THRESHOLD) {
        return
      }

      setDragState((prev) =>
        prev
          ? {
              ...prev,
              pointerX: e.clientX,
              pointerY: e.clientY,
              visible: true,
            }
          : null
      )
    }

    window.addEventListener('pointermove', onPointerMove)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [dragState])

  return (
    <>
      <Container
        initial={{
          background: '#FFF',
        }}
        whileHover={{
          background: 'rgb(242, 243, 247)',
        }}
        onClick={() => {
          if (!dragState?.visible) {
            handleClick()
          }
          setDragState(null)
        }}
        $isExpired={isExpired}
        onPointerDown={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()

          const pointerX = e.clientX
          const pointerY = e.clientY

          const offsetX = pointerX - rect.left
          const offsetY = pointerY - rect.top

          setDragState({
            cardId: id,
            fromColumnId: columnId,
            pointerX,
            pointerY,
            offsetX,
            offsetY,
            visible: false,
          })

          e.currentTarget.setPointerCapture(e.pointerId)

          dragStartPointRef.current = {
            x: e.clientX,
            y: e.clientY,
          }
        }}
      >
        <Title>{title}</Title>
      </Container>
      {dragState && dragState.visible && (
        <Container
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            pointerEvents: 'none',
            zIndex: 1000,
            transform: `translate3d(
        ${dragState.pointerX - dragState.offsetX}px,
        ${dragState.pointerY - dragState.offsetY}px,
        0
      )`,
            background: '#FFF',
          }}
        >
          <Title>{title}</Title>
        </Container>
      )}
    </>
  )
})
