import { Modal } from '../modal'
import type { WithOverlayId } from '../modal/modal.types'
import { Input } from '../input'
import { Label } from '../label/label'
import styled from '@emotion/styled'
import { Button } from '../button'
import { useColumnTitleForm, type ColumnTitleForm } from '@/lib/hooks'
import { overlay } from 'overlay-kit'
import { useCallback, type KeyboardEventHandler } from 'react'

const Inner = styled.div`
  display: flex;
  flex-direction: column;
`

export const AddColumnModal = ({ overlayId }: WithOverlayId) => {
  const { form, register, onSubmit, isPendingCreateColumn } =
    useColumnTitleForm({
      mode: 'create',
    })

  const formError = form.formState.errors.title

  const onFormKeydown = useCallback<KeyboardEventHandler<HTMLFormElement>>(
    (e) => {
      if (e.key === 'Enter' && !!formError) {
        e.preventDefault()
      }
    },
    [formError]
  )

  const closeOverlay = useCallback(() => {
    if (overlayId) {
      overlay.close(overlayId)
    }
  }, [overlayId])

  const handleSubmitForm = useCallback(
    (values: ColumnTitleForm) => {
      onSubmit(values)
      closeOverlay()
    },
    [closeOverlay, onSubmit]
  )

  return (
    <Modal overlayId={overlayId}>
      <form
        onKeyDown={onFormKeydown}
        onSubmit={form.handleSubmit(handleSubmitForm)}
      >
        <Inner>
          <Label>컬럼 제목</Label>
          <Input placeholder="제목을 입력해주세요" {...register()} />
          {formError && <p style={{ color: 'red' }}>{formError.message}</p>}
          <Button
            type="submit"
            disabled={isPendingCreateColumn || !!formError}
            style={{ marginTop: '1rem', marginLeft: 'auto' }}
          >
            생성하기
          </Button>
        </Inner>
      </form>
    </Modal>
  )
}
