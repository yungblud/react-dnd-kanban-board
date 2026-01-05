import styled from '@emotion/styled'
import type { PropsWithChildren } from 'react'

const KanbanWrapper = styled.div`
  display: flex;
  flex-direction: row;
`

export const KanbanContainer = ({ children }: PropsWithChildren) => {
  return <KanbanWrapper>{children}</KanbanWrapper>
}
