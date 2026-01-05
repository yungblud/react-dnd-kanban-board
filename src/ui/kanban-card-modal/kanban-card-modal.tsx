import type { Card } from '@/types'
import { Modal } from '../modal'
import { memo, useEffect } from 'react'
import type { WithOverlayId } from '../modal/modal.types'
import { format, isBefore, isValid } from 'date-fns'
import { useForm } from 'react-hook-form'
import styled from '@emotion/styled'
import {
  queryKeys,
  useRemoveCardMutation,
  useUpdateCardMutation,
} from '@/api/queries'
import { useQueryClient } from '@tanstack/react-query'
import { overlay } from 'overlay-kit'

const ModalInner = styled.div`
  display: flex;
  flex-direction: column;
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

    // @TODO: implement optimistic update
    const { mutate: removeCard, isPending: isPendingRemoveCard } =
      useRemoveCardMutation({
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
          <label>제목</label>
          <input {...register('title')} />
          <label>설명</label>
          <textarea {...register('description')}>{description}</textarea>
          <label>마감일</label>
          <input
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
          <label>생성일</label>
          <p>{formatDate(createdAt)}</p>
          <label>수정일</label>
          <p>{formatDate(updatedAt)}</p>
          {formState.isDirty && (
            <button
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
            </button>
          )}
          <button
            onClick={() => {
              overlay.open(
                ({ isOpen, overlayId }) =>
                  isOpen && (
                    <Modal overlayId={overlayId}>
                      삭제하시겠습니까?
                      <button
                        onClick={() => {
                          if (isPendingRemoveCard) return
                          removeCard({
                            id,
                          })
                        }}
                      >
                        네
                      </button>
                    </Modal>
                  )
              )
            }}
          >
            삭제하기
          </button>
        </ModalInner>
      </Modal>
    )
  }
)
