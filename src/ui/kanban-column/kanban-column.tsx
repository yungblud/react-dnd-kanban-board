import styled from '@emotion/styled'
import { memo, type PropsWithChildren } from 'react'
import type { Column } from '../../types'
import { Button } from '../button'

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
    children,
    title,
    onClickUpdate,
    onClickRemove,
    onClickAddCard,
  }: PropsWithChildren<
    Column & {
      onClickUpdate?: () => void
      onClickRemove?: () => void
      onClickAddCard?: () => void
    }
  >) => {
    return (
      <Column>
        <Title>{title}</Title>
        <Button onClick={onClickUpdate}>수정하기</Button>
        <Button onClick={onClickRemove} style={{ marginTop: '0.5rem' }}>
          삭제하기
        </Button>
        {children}
        <Button onClick={onClickAddCard} style={{ marginTop: '0.85rem' }}>
          카드 추가
        </Button>
      </Column>
    )
  }
)
