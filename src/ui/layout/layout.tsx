import styled from '@emotion/styled'
import type { ReactNode } from 'react'

const LayoutWrapper = styled.div`
  box-sizing: border-box;
  margin-left: auto;
  margin-right: auto;

  border-left: 1px solid rgb(242, 243, 247);
  border-right: 1px solid rgb(242, 243, 247);
  border-bottom: 1px solid rgb(242, 243, 247);
  height: auto;

  padding: 3.5rem;
  overflow: auto;
`

const BtnWrapper = styled.div`
  margin-bottom: 1rem;
`

export const Layout = ({
  addColumnBtn,
  kanban,
}: {
  addColumnBtn: ReactNode
  kanban: ReactNode
}) => {
  return (
    <LayoutWrapper>
      <BtnWrapper>{addColumnBtn}</BtnWrapper>
      {kanban}
    </LayoutWrapper>
  )
}
