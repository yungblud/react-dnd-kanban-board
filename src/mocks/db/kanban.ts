import type { Card, Column } from '@/types'
import { mockData } from '../data'
import { uuid } from '../utils'
import type { z } from 'zod'
import type {
  CreateCardRequestBodySchema,
  MoveCardRequestBodySchema,
  UpdateCardRequestBodySchema,
} from '../types'

export const kanbanDb = {
  listColumns: () => mockData.initialColumns,
  addColumn: ({ title }: { title: string }) => {
    const existing = [...kanbanDb.listColumns()].sort(
      (a, b) => a.order - b.order
    )
    const lastOrder = existing.at(-1)?.order ?? 0
    const newColumn: Column = {
      createdAt: new Date().toISOString(),
      id: uuid(),
      order: lastOrder + 1,
      title,
    }
    mockData.initialColumns.push(newColumn)
    return mockData.initialColumns
  },
  getColumn: ({ id }: { id: string }) => {
    const columns = kanbanDb.listColumns()
    return columns.find((column) => column.id === id)
  },
  updateColumn: ({ id, title }: { id: string; title: string }) => {
    const column = kanbanDb.getColumn({ id })
    if (!column) return null
    column.title = title
    return column
  },
  removeColumn: ({ id }: { id: string }) => {
    mockData.initialColumns = mockData.initialColumns.filter(
      (column) => column.id !== id
    )
    const deletedCards = [...mockData.initialCards].filter(
      (card) => card.columnId === id
    )
    mockData.initialCards = [...mockData.initialCards].filter(
      (card) => card.columnId !== id
    )
    return {
      deletedCards,
    }
  },
  listCards: (params?: { columnId: string }) => {
    if (!params) return mockData.initialCards

    const { columnId } = params
    const columns = kanbanDb.listColumns()
    const allCards = mockData.initialCards

    const column = columns.find((column) => column.id === columnId)
    const cards = allCards.filter((card) => card.columnId === column?.id)
    return cards
  },
  getCard: ({ id }: { id: string }) => {
    const cards = kanbanDb.listCards()
    return cards.find((card) => card.id === id)
  },
  addCard: ({
    column_id: columnId,
    title,
    description,
    due_date: dueDate,
  }: z.infer<typeof CreateCardRequestBodySchema>) => {
    const column = kanbanDb.getColumn({ id: columnId })
    const cards = kanbanDb.listCards({ columnId: column!.id })
    // Card Order는 0부터 시작
    const lastOrder =
      cards.sort((a, b) => a.order - b.order).at(-1)?.order ?? -1
    const newCard = {
      columnId,
      createdAt: new Date().toISOString(),
      description: description,
      dueDate: dueDate,
      id: uuid(),
      order: lastOrder + 1,
      title: title,
      updatedAt: new Date().toISOString(),
    }
    mockData.initialCards.push(newCard)
    return newCard
  },
  updateCard: ({
    title,
    description,
    due_date: dueDate,
    id,
  }: z.infer<typeof UpdateCardRequestBodySchema> & { id: string }) => {
    const cards = [...mockData.initialCards].filter((card) => card.id !== id)
    const card = [...mockData.initialCards].find((card) => card.id === id)!
    mockData.initialCards = cards
    const newCardValue: Card = {
      ...card,
      title: title ?? card.title,
      description: description ?? card.description,
      dueDate: dueDate ?? card.dueDate,
    }
    cards.push(newCardValue)
    return newCardValue
  },
  removeCard: ({ id }: { id: string }) => {
    mockData.initialCards = [...mockData.initialCards].filter(
      (card) => card.id !== id
    )
  },
  moveCard: ({
    id,
    target_column_id: targetColumnId,
    new_order: newOrder,
  }: z.infer<typeof MoveCardRequestBodySchema> & {
    id: string
  }) => {
    const card = kanbanDb.getCard({ id })!
    const column = kanbanDb.getColumn({ id: targetColumnId })!
    if (column.id !== card.columnId) {
      mockData.initialCards = [...mockData.initialCards].filter(
        (card) => card.id !== id
      )
    }
    const movedCard: Card = {
      ...card,
      columnId: targetColumnId,
    }
    const cards = [...mockData.initialCards]
      .filter((card) => card.columnId === column.id)
      .sort((a, b) => a.order - b.order)

    cards.splice(newOrder, 0, movedCard)

    const reordered = cards.map((card, index) => ({
      ...card,
      order: index,
    }))

    mockData.initialCards = [
      ...mockData.initialCards.filter((card) => card.columnId !== column.id),
      ...reordered,
    ]

    return movedCard
  },
}
