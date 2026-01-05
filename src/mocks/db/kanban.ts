import type { Column } from '@/types'
import { mockData } from '../data'
import { uuid } from '../utils'

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
  listCards: (params?: { columnId: string }) => {
    if (!params) return mockData.initialCards

    const { columnId } = params
    const columns = kanbanDb.listColumns()
    const allCards = mockData.initialCards

    const column = columns.find((column) => column.id === columnId)
    const card = allCards.filter((card) => card.columnId === column?.id)
    return card
  },
}
