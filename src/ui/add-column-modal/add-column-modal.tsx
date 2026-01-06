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

  const onSubmit = useCallback(
    (values: Form) => {
      if (isPendingCreateColumn) return

      createColumn({ title: values.title })
    },
    [createColumn, isPendingCreateColumn]
  )

  return (
    <Modal overlayId={overlayId}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Inner>
          <Label>컬럼 제목</Label>
          <Input
            placeholder="제목을 입력해주세요"
            {...form.register('title', {
              required: '제목을 입력해주세요',
              validate: (value) =>
                !!value.split(' ').join('') ||
                '공백만으로는 생성할 수 없습니다',
            })}
          />
          {form.formState.errors.title && (
            <p>{form.formState.errors.title.message}</p>
          )}
          <Button
            type="submit"
            disabled={isPendingCreateColumn}
            style={{ marginTop: '1rem', marginLeft: 'auto' }}
          >
            생성하기
          </Button>
        </Inner>
      </form>
    </Modal>
  )
}
