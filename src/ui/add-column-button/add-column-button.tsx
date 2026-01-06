import { Button } from '../button'
import { useCallback } from 'react'
import { overlay } from 'overlay-kit'
import { AddColumnModal } from '../add-column-modal'

export const AddColumnButton = () => {
  const handleClick = useCallback(() => {
    overlay.open(
      ({ isOpen, overlayId }) =>
        isOpen && <AddColumnModal overlayId={overlayId} />
    )
  }, [])

  return <Button onClick={handleClick}>컬럼 추가</Button>
}
