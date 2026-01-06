import styled from '@emotion/styled'
import { forwardRef, type InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement>

const InputStyled = styled.input`
  border: 1px solid rgb(242, 243, 247);
  padding: 0.5rem;
  border-radius: 4px;
`

export const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return <InputStyled ref={ref} {...props} />
})
