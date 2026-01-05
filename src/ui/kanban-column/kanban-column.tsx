import styled from '@emotion/styled'
import { memo, useCallback, type PropsWithChildren } from 'react'
import type { Card, Column } from '../../types'
import { Button } from '../button'
import { useDragStore } from '@/lib/store'

const Column = styled.div`
  min-height: 520px;
  min-width: 268px;

  padding: 0.875rem;

  background-color: #e6e2d7;

  border-radius: 12px;

  display: flex;
  flex-direction: column;

  & + & {
    margin-left: 1rem;
  }
`

const Title = styled.h1`
  font-size: 1rem;
  margin-bottom: 0.875rem;
`

export const KanbanColumn = memo(
  ({
    id,
    children,
    title,
    onClickUpdate,
    onClickRemove,
    onClickAddCard,
    cards,
  }: PropsWithChildren<
    Column & {
      onClickUpdate?: () => void
      onClickRemove?: () => void
      onClickAddCard?: () => void
    } & {
      cards: Card[]
    }
  >) => {
    const dragState = useDragStore(
      useCallback(
        (state) =>
          state.dragState?.overColumnId === id ? state.dragState : null,
        [id]
      )
    )
    return (
      <Column data-column-id={id}>
        <Title>{title}</Title>
        <Button onClick={onClickUpdate}>수정하기</Button>
        <Button onClick={onClickRemove} style={{ marginTop: '0.5rem' }}>
          삭제하기
        </Button>
        {children}
        {/* 맨 마지막 drop */}
        {dragState?.overColumnId === id &&
          dragState.overIndex === cards.length && <div>Hello</div>}
        <Button onClick={onClickAddCard} style={{ marginTop: '0.85rem' }}>
          카드 추가
        </Button>
      </Column>
    )
  }
)
