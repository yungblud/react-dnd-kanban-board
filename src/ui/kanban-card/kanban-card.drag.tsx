import { useDragStore } from '@/lib/store/drag-store'
import { useShallow } from 'zustand/shallow'
import { Container, Title } from './kanban-card.styled'
import { useListColumnsQuery } from '@/api/queries'
import { useMemo } from 'react'

export const KanbanDragCard = () => {
  const dragState = useDragStore(useShallow((state) => state.dragState))

  const { data: columns } = useListColumnsQuery({
    refetchOnMount: false,
  })

  const dragCard = useMemo(() => {
    return (
      columns?.data
        .flatMap((value) => value.cards)
        .find((value) => value.id === dragState?.cardId) ?? null
    )
  }, [columns?.data, dragState?.cardId])

  if (!dragState || !dragState.visible || !dragCard) return null

  return (
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
      <Title>{dragCard.title}</Title>
    </Container>
  )
}
