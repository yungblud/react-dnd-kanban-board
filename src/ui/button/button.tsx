import styled from '@emotion/styled'
import { forwardRef, type ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement>

const Btn = styled.button`
  margin-left: auto;
  border-radius: 8px;
  border: 1px solid rgb(242, 243, 247);
  padding: 8px 12px;
  font-size: 0.875rem;
`

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ children, onClick, ...otherProps }) => {
    return (
      <Btn onClick={onClick} {...otherProps}>
        {children}
      </Btn>
    )
  }
)
