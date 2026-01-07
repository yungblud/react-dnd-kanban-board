import styled from '@emotion/styled'
import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type PropsWithChildren,
} from 'react'
import type { Column } from '../../types'
import { Button } from '../button'
import { Input } from '../input'
import { useOnClickOutside } from 'usehooks-ts'
import { useColumnTitleForm } from '@/lib/hooks'
import { overlay } from 'overlay-kit'
import { RemoveColumnConfirmModal } from '../remove-column-confirm-modal'
import { KanbanCardModal } from '../kanban-card-modal'

const StyledColumn = styled.div`
  min-height: 520px;
  min-width: 268px;

  padding: 0.875rem;

  background-color: #e6e2d7;

  border-radius: 12px;

  display: flex;
  flex-direction: column;

  & + & {
    margin-left: 1rem;
  }
`

const ChildrenWrapper = styled.div`
  flex: 1;
`

const Title = styled.h1`
  font-size: 1rem;
  margin-bottom: 0.875rem;
  cursor: pointer;
`

export const KanbanColumn = memo(
  ({ id, children, title }: PropsWithChildren<Column>) => {
    const editInputFormRef = useRef<HTMLFormElement>(null!)
    const [editMode, setEditMode] = useState<{ id: string } | null>(null)

    const { form, register, onSubmit, isPendingUpdateColumn } =
      useColumnTitleForm({
        mode: 'edit',
        editId: id,
      })

    const handleClickOutside = useCallback(() => {
      if (isPendingUpdateColumn) return
      onSubmit(form.getValues())
      setEditMode(null)
    }, [form, isPendingUpdateColumn, onSubmit])

    useOnClickOutside(editInputFormRef, handleClickOutside)

    useEffect(() => {
      if (editMode) {
        form.setValue('title', title)
      } else {
        form.reset()
      }
    }, [editMode, form, title])

    const onEditInputKeydown = useCallback<
      KeyboardEventHandler<HTMLInputElement>
    >(
      (e) => {
        if (e.key === 'Enter') {
          if (form.formState.errors.title) {
            return
          }
          if (isPendingUpdateColumn) {
            return
          }
          onSubmit(form.getValues())
          setEditMode(null)
        }
      },
      [form, isPendingUpdateColumn, onSubmit]
    )

    const onClickRemove = useCallback<MouseEventHandler<HTMLButtonElement>>(
      (e) => {
        e.currentTarget.blur()
        overlay.open(
          ({ isOpen, overlayId }) =>
            isOpen && (
              <RemoveColumnConfirmModal overlayId={overlayId} columnId={id} />
            )
        )
      },
      [id]
    )

    const openAddCardModal = useCallback(() => {
      overlay.open(
        ({ isOpen, overlayId }) =>
          isOpen && <KanbanCardModal overlayId={overlayId} columnId={id} />
      )
    }, [id])

    return (
      <StyledColumn data-column-id={id}>
        {editMode && editMode.id === id ? (
          <form ref={editInputFormRef} onSubmit={(e) => e.preventDefault()}>
            <Input {...register()} autoFocus onKeyDown={onEditInputKeydown} />
            {form.formState.errors.title && (
              <p style={{ color: 'red' }}>
                {form.formState.errors.title.message}
              </p>
            )}
          </form>
        ) : (
          <Title onClick={() => setEditMode({ id })}>{title}</Title>
        )}
        <Button onClick={onClickRemove} style={{ marginTop: '0.5rem' }}>
          삭제하기
        </Button>
        <ChildrenWrapper>{children}</ChildrenWrapper>
        <Button onClick={openAddCardModal} style={{ marginTop: '0.85rem' }}>
          카드 추가
        </Button>
      </StyledColumn>
    )
  }
)
