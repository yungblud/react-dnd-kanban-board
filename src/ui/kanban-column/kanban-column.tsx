import styled from '@emotion/styled'
import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEventHandler,
  type PropsWithChildren,
} from 'react'
import type { Card, Column } from '../../types'
import { Button } from '../button'
import { useDragStore } from '@/lib/store'
import { KanbanCardPlaceholder } from '../kanban-card-placeholder'
import { Input } from '../input'
import { useOnClickOutside } from 'usehooks-ts'
import { useColumnTitleForm } from '@/lib/hooks'

const Column = styled.div`
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
`

export const KanbanColumn = memo(
  ({
    id,
    children,
    title,
    onClickRemove,
    onClickAddCard,
    cards,
  }: PropsWithChildren<
    Column & {
      onClickRemove?: () => void
      onClickAddCard?: () => void
    } & {
      cards: Card[]
    }
  >) => {
    const editInputFormRef = useRef<HTMLFormElement>(null!)
    const [editMode, setEditMode] = useState<{ id: string } | null>(null)
    const dragState = useDragStore(
      useCallback(
        (state) =>
          state.dragState?.overColumnId === id ? state.dragState : null,
        [id]
      )
    )

    const { form, register, onSubmit } = useColumnTitleForm({
      mode: 'edit',
      editId: id,
    })

    const handleClickOutside = useCallback(() => {
      onSubmit(form.getValues())
      setEditMode(null)
    }, [form, onSubmit])

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
          onSubmit(form.getValues())
          setEditMode(null)
        }
      },
      [form, onSubmit]
    )

    return (
      <Column data-column-id={id}>
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
        <ChildrenWrapper>
          {children}
          {/* 맨 마지막 drop */}
          {dragState?.overColumnId === id &&
            dragState.overIndex === cards.length && <KanbanCardPlaceholder />}
        </ChildrenWrapper>
        <Button onClick={onClickAddCard} style={{ marginTop: '0.85rem' }}>
          카드 추가
        </Button>
      </Column>
    )
  }
)
