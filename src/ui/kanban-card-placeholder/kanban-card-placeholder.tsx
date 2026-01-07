import { useDragStore } from '@/lib/store'
import styled from '@emotion/styled'
import { memo, useCallback } from 'react'

const Container = styled.div`
  height: 4px;
  width: 100%;
  background-color: blueviolet;
  margin-top: 0.285rem;
  margin-bottom: 0.285rem;
`

/**
 * column 맨 마지막 drop
 */
// eslint-disable-next-line react-refresh/only-export-components
const ColumnPlaceholder = memo(
  ({
    columnId,
    columnCardCount,
  }: {
    columnId: string
    columnCardCount: number
  }) => {
    const dragState = useDragStore(
      useCallback(
        (state) =>
          state.dragState?.overColumnId === columnId &&
          state.dragState.overIndex === columnCardCount
            ? state.dragState
            : null,
        [columnCardCount, columnId]
      )
    )

    if (!dragState) return null

    return <Container />
  }
)

/**
 * card 사이 drop
 */
// eslint-disable-next-line react-refresh/only-export-components
const CardPlaceholder = memo(
  ({ columnId, cardIndex }: { columnId: string; cardIndex: number }) => {
    const dragState = useDragStore(
      useCallback(
        (state) =>
          state.dragState?.overColumnId === columnId &&
          state.dragState.overIndex === cardIndex
            ? state.dragState
            : null,
        [cardIndex, columnId]
      )
    )

    if (!dragState) return null

    return <Container />
  }
)

export const KanbanCardPlaceholder = {
  ColumnPlaceholder,
  CardPlaceholder,
}
