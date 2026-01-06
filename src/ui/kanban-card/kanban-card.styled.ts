import styled from '@emotion/styled'
import { motion } from 'framer-motion'

const motionDiv = motion.div

export const Container = styled(motionDiv)<{ $isExpired?: boolean }>`
  border-radius: 12px;
  border: ${(props) =>
    props.$isExpired ? '1px solid red' : '1px solid black'};

  padding: 12px 12px;
  cursor: pointer;
  width: 240px;

  margin-top: 0.5rem;
`

export const Title = styled.p`
  margin: unset;
  font-size: 0.875rem;
  font-weight: 550;
`
