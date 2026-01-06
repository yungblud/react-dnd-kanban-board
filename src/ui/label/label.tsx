import styled from '@emotion/styled'
import { forwardRef, type LabelHTMLAttributes } from 'react'

const LabelStyled = styled.label`
  font-weight: 400;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  margin-top: 1rem;
`

type Props = LabelHTMLAttributes<HTMLLabelElement>

export const Label = forwardRef<HTMLLabelElement, Props>((props, ref) => {
  return <LabelStyled ref={ref} {...props} />
})
