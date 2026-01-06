import { Button } from '../button'
import { useCallback, type MouseEventHandler } from 'react'
import { overlay } from 'overlay-kit'
import { AddColumnModal } from '../add-column-modal'

export const AddColumnButton = () => {
  const handleClick = useCallback<MouseEventHandler<HTMLButtonElement>>((e) => {
    e.currentTarget.blur()
    overlay.open(
      ({ isOpen, overlayId }) =>
        isOpen && <AddColumnModal overlayId={overlayId} />
    )
  }, [])

  return <Button onClick={handleClick}>컬럼 추가</Button>
}
