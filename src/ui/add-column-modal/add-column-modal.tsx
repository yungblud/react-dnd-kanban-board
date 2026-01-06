import { useQueryClient } from '@tanstack/react-query'
import { Modal } from '../modal'
import type { WithOverlayId } from '../modal/modal.types'
import { queryKeys, useCreateColumnMutation } from '@/api/queries'
import { Input } from '../input'
import { Label } from '../label/label'
import { useCallback } from 'react'
import styled from '@emotion/styled'
import { Button } from '../button'
import { useForm } from 'react-hook-form'
import { overlay } from 'overlay-kit'

const Inner = styled.div`
  display: flex;
  flex-direction: column;
`

type Form = {
  title: string
}

export const AddColumnModal = ({ overlayId }: WithOverlayId) => {
  const queryClient = useQueryClient()
  // @TODO: implement optimistic update
  const { mutate: createColumn, isPending: isPendingCreateColumn } =
    useCreateColumnMutation({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.column.list(),
        })
        if (overlayId) {
          overlay.close(overlayId)
        }
      },
    })

  const form = useForm<Form>()

  const handleCreateColumn = useCallback(() => {
    if (isPendingCreateColumn) return

    const titleValue = form.getValues().title

    createColumn({ title: titleValue })
  }, [createColumn, form, isPendingCreateColumn])

  return (
    <Modal overlayId={overlayId}>
      <Inner>
        <Label>컬럼 제목</Label>
        <Input placeholder="제목을 입력해주세요" {...form.register('title')} />
        <Button
          onClick={handleCreateColumn}
          style={{ marginTop: '1rem', marginLeft: 'auto' }}
        >
          생성하기
        </Button>
      </Inner>
    </Modal>
  )
}
