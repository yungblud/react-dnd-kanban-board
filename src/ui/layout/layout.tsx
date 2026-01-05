import styled from '@emotion/styled'
import type { PropsWithChildren } from 'react'

const LayoutWrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  width: 820px;
  border-left: 1px solid black;
  border-right: 1px solid black;
  height: 100vh;
`

export const Layout = ({ children }: PropsWithChildren) => {
  return <LayoutWrapper>{children}</LayoutWrapper>
}
