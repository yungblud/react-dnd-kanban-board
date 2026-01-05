import styled from '@emotion/styled'
import { memo, type PropsWithChildren } from 'react'
import type { Column } from '../../types'

const Column = styled.div`
  border: 1px solid #ababab;
  min-height: 520px;

  & + & {
    margin-left: 1.5rem;
  }
`

export const KanbanColumn = memo(
  ({
    children,
    title,
    onClickUpdate,
  }: PropsWithChildren<
    Column & {
      onClickUpdate?: () => void
    }
  >) => {
    return (
      <Column>
        {title}
        <button onClick={onClickUpdate}>수정하기</button>
        {children}
      </Column>
    )
  }
)
