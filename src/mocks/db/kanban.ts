import type { Column } from '@/types'
import { mockData } from '../data'
import { uuid } from '../utils'
import type { z } from 'zod'
import type { CreateCardRequestBodySchema } from '../types'

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
  addCard: ({
    column_id: columnId,
    title,
    description,
    due_date: dueDate,
  }: z.infer<typeof CreateCardRequestBodySchema>) => {
    const column = kanbanDb.getColumn({ id: columnId })
    const cards = kanbanDb.listCards({ columnId: column!.id })
    const lastOrder = cards.sort((a, b) => a.order - b.order).at(-1)?.order ?? 0
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
}
