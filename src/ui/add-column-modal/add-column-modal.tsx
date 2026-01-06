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
import type { ColumnWithCard, HttpResponse } from '@/types'

const Inner = styled.div`
  display: flex;
  flex-direction: column;
`

type Form = {
  title: string
}

export const AddColumnModal = ({ overlayId }: WithOverlayId) => {
  const queryClient = useQueryClient()
  const { mutate: createColumn, isPending: isPendingCreateColumn } =
    useCreateColumnMutation({
      onMutate: async (variables) => {
        await queryClient.cancelQueries({
          queryKey: queryKeys.column.list(),
        })

        const prevData = queryClient.getQueryData<
          HttpResponse<ColumnWithCard[]>
        >(queryKeys.column.list())

        const newColumn = {
          cards: [],
          createdAt: new Date().toISOString(),
          id: crypto.randomUUID(),
          order: prevData?.data ? (prevData.data.at(-1)?.order ?? 0) + 1 : 1,
          title: variables.title,
        }

        const newData: HttpResponse<ColumnWithCard[]> = {
          ...prevData,
          data: prevData?.data ? prevData.data.concat(newColumn) : [newColumn],
        }

        queryClient.setQueryData(queryKeys.column.list(), newData)

        if (overlayId) {
          overlay.close(overlayId)
        }

        return {
          prevData,
          newData,
        }
      },
      onError: (error, variables, ctx) => {
        if (ctx?.prevData) {
          queryClient.setQueryData(queryKeys.column.list(), ctx.prevData)
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.column.list(),
        })
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
