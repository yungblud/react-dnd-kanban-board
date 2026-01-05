import styled from '@emotion/styled'
import { overlay } from 'overlay-kit'
import { useCallback, type PropsWithChildren } from 'react'
import type { WithOverlayId } from './modal.types'

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const Content = styled.div`
  background: #fff;
  border-radius: 8px;
  min-width: 320px;
  max-width: 90vw;
  padding: 24px;
`

export const Modal = ({
  children,
  overlayId,
}: WithOverlayId<PropsWithChildren>) => {
  const close = useCallback(() => {
    if (overlayId) {
      overlay.close(overlayId)
    } else {
      overlay.closeAll()
    }
  }, [overlayId])

  return (
    <Overlay
      onClick={(e) => {
        e.stopPropagation()
        close()
      }}
    >
      <Content onClick={(e) => e.stopPropagation()}>{children}</Content>
    </Overlay>
  )
}
