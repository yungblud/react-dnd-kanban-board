import styled from '@emotion/styled'
import { memo } from 'react'

const Column = styled.div`
  border: 1px solid #ababab;
  min-height: 520px;

  & + & {
    margin-left: 1.5rem;
  }
`

export const KanbanColumn = memo(
  ({ state }: { state: 'todo' | 'in-progress' | 'done' }) => {
    return <Column>{state}</Column>
  }
)
