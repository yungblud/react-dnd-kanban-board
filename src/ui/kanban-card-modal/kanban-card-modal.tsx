import { Modal } from '../modal'
import { memo, useCallback, useMemo } from 'react'
import type { WithOverlayId } from '../modal/modal.types'
import { format, isBefore, isValid, parse } from 'date-fns'
import { useForm, useFormState } from 'react-hook-form'
import styled from '@emotion/styled'
import { produce } from 'immer'
import {
  queryKeys,
  useCreateCardMutation,
  useListColumnsQuery,
  useUpdateCardMutation,
} from '@/api/queries'
import { useQueryClient } from '@tanstack/react-query'
import { overlay } from 'overlay-kit'
import { Button } from '../button'
import { KanbanCardRemoveModal } from '../kanban-card-remove-modal'
import { Input } from '../input'
import { Label } from '../label/label'
import type { ColumnWithCard, HttpResponse } from '@/types'

const dueDateFormat = 'yyyy.MM.dd HH:mm'

const ModalInner = styled.div`
  display: flex;
  flex-direction: column;
  width: 662px;
`

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
`

const Textarea = styled.textarea`
  border: 1px solid rgb(242, 243, 247);
  padding: 0.5rem;
  border-radius: 4px;
`

const formatDate = (dateStr: string, formatStr?: string) =>
  format(new Date(dateStr), formatStr ? formatStr : dueDateFormat)

type Form = {
  title: string
  description: string
  dueDate: string
}

export const KanbanCardModal = memo(
  ({
    overlayId,
    id,
    columnId,
  }: WithOverlayId<{ id?: string; columnId?: string }>) => {
    const isEditMode = useMemo(() => !!id, [id])
    const isCreateMode = useMemo(() => !!columnId, [columnId])
    const { data: columnsData } = useListColumnsQuery({
      enabled: isEditMode,
    })

    const card = useMemo(
      () =>
        isEditMode
          ? columnsData?.data
              .flatMap((value) => value.cards)
              .find((value) => value.id === id)
          : undefined,
      [columnsData?.data, id, isEditMode]
    )

    const { register, formState, control, handleSubmit, reset } = useForm<Form>(
      {
        mode: 'onChange',
        defaultValues: {
          title: card?.title ?? '',
          description: card?.description ?? '',
          dueDate: card?.dueDate ? formatDate(card.dueDate) : '',
        },
      }
    )

    const { dirtyFields, errors: formErrors } = useFormState({
      control,
    })

    const hasFormError = useMemo(
      () =>
        !!formErrors.description || !!formErrors.dueDate || !!formErrors.title,
      [formErrors.description, formErrors.dueDate, formErrors.title]
    )

    const isExpired = useMemo(() => {
      if (dirtyFields.dueDate) {
        return false
      } else {
        if (!card?.dueDate) return false
        if (!isValid(new Date(card.dueDate))) return false

        const now = new Date()

        return isBefore(new Date(card.dueDate), now)
      }
    }, [card?.dueDate, dirtyFields.dueDate])

    const onClickRemoveButton = useCallback(() => {
      if (!id || !isEditMode) return
      overlay.open(
        ({ isOpen, overlayId }) =>
          isOpen && <KanbanCardRemoveModal overlayId={overlayId} id={id} />
      )
    }, [id, isEditMode])

    const queryClient = useQueryClient()

    const { mutate: createCard, isPending: isPendingCreateCard } =
      useCreateCardMutation({
        onMutate: async (variables) => {
          await queryClient.cancelQueries({
            queryKey: queryKeys.column.list(),
          })

          const prevData = queryClient.getQueryData<
            HttpResponse<ColumnWithCard[]>
          >(queryKeys.column.list())

          const newData: HttpResponse<ColumnWithCard[]> | undefined = prevData
            ? produce(prevData, (draft) => {
                const column = draft.data.find((c) => c.id === columnId)
                if (!column) return

                const lastOrder = column.cards.at(-1)?.order
                const nextOrder =
                  typeof lastOrder === 'number' ? lastOrder + 1 : 0

                column.cards.push({
                  id: crypto.randomUUID(),
                  columnId: columnId!,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  title: variables.title,
                  description: variables.description,
                  dueDate: variables.dueDate,
                  order: nextOrder,
                })
              })
            : undefined

          queryClient.setQueryData<HttpResponse<ColumnWithCard[]>>(
            queryKeys.column.list(),
            newData
          )

          return {
            newData,
            prevData,
          }
        },
        onError: (error, variables, ctx) => {
          if (ctx?.prevData) {
            queryClient.setQueryData(queryKeys.column.list(), ctx.prevData)
          }
        },
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: queryKeys.column.list(),
          })
        },
      })

    const { mutate: updateCard, isPending: isPendingUpdateCard } =
      useUpdateCardMutation({
        onMutate: async (variables) => {
          await queryClient.cancelQueries({
            queryKey: queryKeys.column.list(),
          })

          const prevData = queryClient.getQueryData<
            HttpResponse<ColumnWithCard[]>
          >(queryKeys.column.list())

          const newData: HttpResponse<ColumnWithCard[]> | undefined = prevData
            ? produce(prevData, (draft) => {
                const now = new Date().toISOString()

                for (const column of draft.data) {
                  const card = column.cards.find(
                    (card) => card.id === variables.id
                  )

                  if (!card) continue

                  if (variables.title) {
                    card.title = variables.title
                  }

                  if (variables.description) {
                    card.description = variables.description
                  }

                  if (variables.dueDate) {
                    card.dueDate = variables.dueDate
                  }

                  card.updatedAt = now
                  break
                }
              })
            : undefined

          queryClient.setQueryData(queryKeys.column.list(), newData)

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
        onSettled: (data) => {
          queryClient.invalidateQueries({
            queryKey: queryKeys.column.list(),
          })
          const newCardData = data?.data
          if (!newCardData) return
          reset(
            {
              title: newCardData.title,
              description: newCardData.description ?? '',
              dueDate: newCardData.dueDate
                ? formatDate(newCardData.dueDate)
                : '',
            },
            {
              keepDirty: false,
              keepTouched: false,
            }
          )
        },
      })

    const onSubmit = useCallback(
      (values: Form) => {
        if (isEditMode) {
          if (isPendingUpdateCard) return

          updateCard({
            id: id!,
            title: dirtyFields.title ? values.title : undefined,
            description: dirtyFields.description
              ? values.description
              : undefined,
            dueDate: dirtyFields.dueDate
              ? new Date(values.dueDate).toISOString()
              : undefined,
          })
        }

        if (isCreateMode) {
          if (isPendingCreateCard) return
          createCard({
            columnId: columnId!,
            title: values.title,
            description: dirtyFields.description ? values.description : null,
            dueDate: dirtyFields.dueDate
              ? new Date(values.dueDate).toISOString()
              : null,
          })
          if (overlayId) {
            overlay.close(overlayId)
          }
        }
      },
      [
        columnId,
        createCard,
        dirtyFields.description,
        dirtyFields.dueDate,
        dirtyFields.title,
        id,
        isCreateMode,
        isEditMode,
        isPendingCreateCard,
        isPendingUpdateCard,
        overlayId,
        updateCard,
      ]
    )

    return (
      <Modal overlayId={overlayId}>
        <ModalInner>
          <ModalForm onSubmit={handleSubmit(onSubmit)}>
            <Label>제목</Label>
            <Input
              {...register('title', {
                required: true,
                maxLength: 100,
                validate: (value) =>
                  !!value.split(' ').join('') ||
                  '공백만으로는 생성할 수 없습니다',
              })}
            />
            {formState.errors.title && (
              <p style={{ color: 'red' }}>{formState.errors.title.message}</p>
            )}
            <Label>설명</Label>
            <Textarea {...register('description')}>
              {card?.description}
            </Textarea>
            <Label>마감일</Label>
            <Input
              style={{ color: isExpired ? 'red' : 'black' }}
              placeholder={dueDateFormat}
              {...register('dueDate', {
                maxLength: 1000,
                validate: (value) => {
                  // 빈 값 허용 시
                  if (!value) return true

                  // 1️⃣ 정확한 포맷으로 파싱
                  const parsed = parse(value, dueDateFormat, new Date())

                  // 2️⃣ date-fns 파싱 결과 유효성
                  if (!isValid(parsed)) {
                    return `${dueDateFormat} 형태의 날짜를 입력해주세요`
                  }

                  // 3️⃣ 입력 문자열과 포맷이 완전히 일치하는지 검증
                  // (예: 2024.13.40 99:99:99 같은 케이스 차단)
                  const reformatted = format(parsed, dueDateFormat)
                  if (reformatted !== value) {
                    return `${dueDateFormat} 형태의 날짜를 입력해주세요`
                  }

                  return true
                },
              })}
            />
            {formState.errors.dueDate && (
              <p style={{ color: 'red' }}>{formState.errors.dueDate.message}</p>
            )}
            {isEditMode && (
              <>
                <Label>생성일</Label>
                <p>{card?.createdAt && formatDate(card.createdAt)}</p>
                <Label>수정일</Label>
                <p>{card?.updatedAt && formatDate(card.updatedAt)}</p>
              </>
            )}
            {formState.isDirty && (
              <Button
                type="submit"
                disabled={
                  isEditMode
                    ? isPendingUpdateCard || hasFormError
                    : isPendingCreateCard || hasFormError
                }
              >
                {isEditMode ? '저장하기' : '카드 만들기'}
              </Button>
            )}
          </ModalForm>
          {isEditMode && (
            <Button onClick={onClickRemoveButton}>삭제하기</Button>
          )}
        </ModalInner>
      </Modal>
    )
  }
)
