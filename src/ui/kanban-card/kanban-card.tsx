import type { Card } from '@/types'
import { overlay } from 'overlay-kit'
import { memo, useCallback, useEffect, useRef } from 'react'
import { KanbanCardModal } from '../kanban-card-modal'
import { isBefore } from 'date-fns'
import { useDragStore } from '@/lib/store'
import { useShallow } from 'zustand/shallow'
import { queryKeys, useMoveCardMutation } from '@/api/queries'
import { useQueryClient } from '@tanstack/react-query'
import { KanbanCardPlaceholder } from '../kanban-card-placeholder'
import { Container, Title } from './kanban-card.styled'
import { KanbanDragCard } from './kanban-card.drag'

const DRAG_THRESHOLD = 6 // px

function getTargetColumn(x: number, y: number): HTMLElement | null {
  const columns = document.querySelectorAll<HTMLElement>('[data-column-id]')

  for (const col of columns) {
    const rect = col.getBoundingClientRect()
    if (
      x >= rect.left &&
      x <= rect.right &&
      y >= rect.top &&
      y <= rect.bottom
    ) {
      return col
    }
  }
  return null
}

function getInsertIndex(columnEl: HTMLElement, pointerY: number) {
  const cards = Array.from(
    columnEl.querySelectorAll<HTMLElement>('[data-card-id]')
  )

  for (let i = 0; i < cards.length; i++) {
    const rect = cards[i].getBoundingClientRect()
    if (pointerY < rect.top + rect.height / 2) {
      return i
    }
  }

  return cards.length
}

export const KanbanCard = memo((props: Card & { index: number }) => {
  const { title, dueDate, id, columnId, index } = props

  const dragStartPointRef = useRef<{ x: number; y: number } | null>(null)

  // @TODO: enhance subscribe and rerender issue
  const dragState = useDragStore(useShallow((state) => state.dragState))
  const initializeDragState = useDragStore(
    useShallow((state) => state.initialize)
  )
  const resetDragState = useDragStore(useShallow((state) => state.reset))
  const moveDragState = useDragStore(useShallow((state) => state.move))

  const now = new Date()
  const isExpired = dueDate ? isBefore(new Date(dueDate), now) : false

  const openKanbanCardModal = useCallback(() => {
    const overlayId = overlay.open(
      ({ isOpen, overlayId }) =>
        isOpen && <KanbanCardModal {...props} overlayId={overlayId} id={id} />
    )

    return () => overlay.close(overlayId)
  }, [props, id])

  useEffect(() => {
    if (!dragState) return
    const onPointerMove = (e: PointerEvent) => {
      if (!dragStartPointRef.current) return

      const dx = e.clientX - dragStartPointRef.current.x
      const dy = e.clientY - dragStartPointRef.current.y

      if (Math.sqrt(dx * dx + dy * dy) <= DRAG_THRESHOLD) {
        return
      }
      if (!dragState) {
        resetDragState()
        return
      }

      const pointerX = e.clientX
      const pointerY = e.clientY

      const columnEl = getTargetColumn(pointerX, pointerY)
      if (!columnEl) {
        moveDragState({ pointerX, pointerY })
        return
      }

      const overColumnId = columnEl.dataset.columnId!
      const overIndex = getInsertIndex(columnEl, pointerY)

      moveDragState({
        pointerX,
        pointerY,
        overColumnId,
        overIndex,
      })
    }

    window.addEventListener('pointermove', onPointerMove)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [dragState, moveDragState, resetDragState])

  const queryClient = useQueryClient()

  const { mutate: moveCard } = useMoveCardMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.column.list(),
      })
    },
  })

  return (
    <>
      {dragState?.overColumnId === columnId &&
        dragState.overIndex === index && <KanbanCardPlaceholder />}
      <Container
        data-card-id={id}
        initial={{
          background: '#FFF',
        }}
        whileHover={{
          background: 'rgb(242, 243, 247)',
        }}
        onPointerUp={() => {
          if (!dragState?.visible) {
            openKanbanCardModal()
          }
          if (
            dragState?.overColumnId &&
            typeof dragState.overIndex === 'number'
          ) {
            moveCard({
              id,
              targetColumnId: dragState.overColumnId,
              newOrder: dragState.overIndex,
            })
          }
          resetDragState()
        }}
        $isExpired={isExpired}
        onPointerDown={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()

          const pointerX = e.clientX
          const pointerY = e.clientY

          const offsetX = pointerX - rect.left
          const offsetY = pointerY - rect.top

          initializeDragState({
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
      <KanbanDragCard />
    </>
  )
})
