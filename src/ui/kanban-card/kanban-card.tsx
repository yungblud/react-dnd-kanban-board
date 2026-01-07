import type { Card, ColumnWithCard, HttpResponse } from '@/types'
import { overlay } from 'overlay-kit'
import {
  memo,
  useCallback,
  useEffect,
  useRef,
  type PointerEventHandler,
} from 'react'
import { KanbanCardModal } from '../kanban-card-modal'
import { isBefore } from 'date-fns'
import { useDragStore } from '@/lib/store'
import { useShallow } from 'zustand/shallow'
import { queryKeys, useMoveCardMutation } from '@/api/queries'
import { useQueryClient } from '@tanstack/react-query'
import { KanbanCardPlaceholder } from '../kanban-card-placeholder'
import { Container, Title } from './kanban-card.styled'
import { KanbanDragCard } from './kanban-card.drag'
import { produce } from 'immer'
import { getInsertIndex, getTargetColumn } from './kanban-card.utils'
import { DRAG_THRESHOLD } from './kanban-card.constants'

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
        isOpen && <KanbanCardModal overlayId={overlayId} id={id} />
    )

    return () => overlay.close(overlayId)
  }, [id])

  const queryClient = useQueryClient()

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

  const { mutate: moveCard } = useMoveCardMutation({
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.column.list(),
      })

      const prevData = queryClient.getQueryData<HttpResponse<ColumnWithCard[]>>(
        queryKeys.column.list()
      )

      const newData: HttpResponse<ColumnWithCard[]> | undefined = prevData
        ? produce(prevData, (draft) => {
            const sourceColumn = draft.data.find(
              (col) => col.id === props.columnId
            )
            const targetColumn = draft.data.find(
              (col) => col.id === variables.targetColumnId
            )

            if (!sourceColumn || !targetColumn) return

            const cardIndex = sourceColumn.cards.findIndex(
              (card) => card.id === variables.id
            )

            if (cardIndex === -1) return

            const [movedCard] = sourceColumn.cards.splice(cardIndex, 1)

            // 같은 컬럼 내 이동
            if (sourceColumn.id === targetColumn.id) {
              targetColumn.cards.splice(variables.newOrder, 0, movedCard)
            } else {
              // 다른 컬럼으로 이동
              movedCard.columnId = targetColumn.id
              targetColumn.cards.splice(variables.newOrder, 0, movedCard)
            }

            // order 재계산 (양쪽 컬럼 모두)
            sourceColumn.cards.forEach((card, index) => {
              card.order = index
            })

            if (sourceColumn.id !== targetColumn.id) {
              targetColumn.cards.forEach((card, index) => {
                card.order = index
              })
            }
          })
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

  const onCardPointerUp = useCallback(() => {
    if (!dragState?.visible) {
      openKanbanCardModal()
    }
    if (dragState?.overColumnId && typeof dragState.overIndex === 'number') {
      moveCard({
        id,
        targetColumnId: dragState.overColumnId,
        newOrder: dragState.overIndex,
      })
    }
    resetDragState()
  }, [dragState, id, moveCard, openKanbanCardModal, resetDragState])

  const onCardPointerDown = useCallback<PointerEventHandler<HTMLDivElement>>(
    (e) => {
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
    },
    [columnId, id, initializeDragState]
  )

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
        onPointerUp={onCardPointerUp}
        $isExpired={isExpired}
        onPointerDown={onCardPointerDown}
      >
        <Title>{title}</Title>
      </Container>
      <KanbanDragCard />
    </>
  )
})
