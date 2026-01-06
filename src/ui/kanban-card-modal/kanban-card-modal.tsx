import type { Card } from '@/types'
import { Modal } from '../modal'
import { memo, useEffect } from 'react'
import type { WithOverlayId } from '../modal/modal.types'
import { format, isBefore, isValid } from 'date-fns'
import { useForm } from 'react-hook-form'
import styled from '@emotion/styled'
import { queryKeys, useUpdateCardMutation } from '@/api/queries'
import { useQueryClient } from '@tanstack/react-query'
import { overlay } from 'overlay-kit'
import { Button } from '../button'
import { KanbanCardRemoveModal } from '../kanban-card-remove-modal'
import { Input } from '../input'
import { Label } from '../label/label'

const ModalInner = styled.div`
  display: flex;
  flex-direction: column;
  width: 662px;
`

const Textarea = styled.textarea`
  border: 1px solid rgb(242, 243, 247);
  padding: 0.5rem;
  border-radius: 4px;
`

const formatDate = (dateStr: string) =>
  format(new Date(dateStr), 'yyyy.MM.dd hh:mm:ss')

type Form = {
  title: string
  description: string
  dueDate: string
}

// @TODO: refactor form state handle
export const KanbanCardModal = memo(
  ({
    overlayId,
    title,
    description,
    dueDate,
    createdAt,
    updatedAt,
    id,
  }: WithOverlayId<Card>) => {
    const now = new Date()
    const isExpired = dueDate ? isBefore(new Date(dueDate), now) : false

    const { register, formState, getValues, setError, watch, clearErrors } =
      useForm<Form>({
        defaultValues: {
          title: title ?? '',
          description: description ?? '',
          dueDate: dueDate ? formatDate(dueDate) : '',
        },
      })

    const formValue = watch()

    useEffect(() => {
      if (
        !isValid(new Date(formValue.dueDate)) &&
        formState.dirtyFields.dueDate
      ) {
        setError('dueDate', {
          message: '마감일 날짜를 맞춰주세요',
        })
      } else {
        clearErrors('dueDate')
      }
    }, [
      clearErrors,
      formState.dirtyFields.dueDate,
      formValue.dueDate,
      setError,
    ])

    const queryClient = useQueryClient()

    // @TODO: implement optimistic update
    const { mutate: updateCard, isPending: isPendingUpdateCard } =
      useUpdateCardMutation({
        onSuccess: () => {
          console.log('success')
          queryClient.invalidateQueries({
            queryKey: queryKeys.column.list(),
          })
        },
      })

    return (
      <Modal overlayId={overlayId}>
        <ModalInner>
          <Label>제목</Label>
          <Input {...register('title')} />
          <Label>설명</Label>
          <Textarea {...register('description')}>{description}</Textarea>
          <Label>마감일</Label>
          <Input
            style={{ color: isExpired ? 'red' : 'black' }}
            {...register('dueDate', {
              validate: (value) => {
                console.log('validate', value)
                return isValid(new Date(value))
              },
            })}
          />
          {formState.errors.dueDate && (
            <p>{formState.errors.dueDate.message}</p>
          )}
          <Label>생성일</Label>
          <p>{formatDate(createdAt)}</p>
          <Label>수정일</Label>
          <p>{formatDate(updatedAt)}</p>
          {formState.isDirty && (
            <Button
              onClick={() => {
                if (isPendingUpdateCard) return
                const formValues = getValues()

                const dirtyFields = formState.dirtyFields
                const isValidDueDate = dirtyFields.dueDate
                  ? isValid(new Date(formValues.dueDate))
                  : true
                if (!isValidDueDate) {
                  setError('dueDate', {
                    message: '마감일 날짜를 맞춰주세요',
                  })
                  return
                }
                updateCard({
                  id,
                  title: dirtyFields.title ? formValues.title : undefined,
                  description: dirtyFields.description
                    ? formValues.description
                    : undefined,
                  dueDate:
                    dirtyFields.dueDate && isValidDueDate
                      ? new Date(formValues.dueDate).toISOString()
                      : undefined,
                })
              }}
            >
              저장하기
            </Button>
          )}
          <Button
            onClick={() => {
              overlay.open(
                ({ isOpen, overlayId }) =>
                  isOpen && (
                    <KanbanCardRemoveModal overlayId={overlayId} id={id} />
                  )
              )
            }}
          >
            삭제하기
          </Button>
        </ModalInner>
      </Modal>
    )
  }
)
