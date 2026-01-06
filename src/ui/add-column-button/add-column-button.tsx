import { Button } from '../button'
import { useCallback, useRef } from 'react'
import { overlay } from 'overlay-kit'
import { AddColumnModal } from '../add-column-modal'

export const AddColumnButton = () => {
  const btnRef = useRef<HTMLButtonElement>(null)
  const handleClick = useCallback(() => {
    overlay.open(
      ({ isOpen, overlayId }) =>
        isOpen && <AddColumnModal overlayId={overlayId} />
    )
    btnRef.current?.blur()
  }, [])

  return (
    <Button ref={btnRef} onClick={handleClick}>
      컬럼 추가
    </Button>
  )
}
