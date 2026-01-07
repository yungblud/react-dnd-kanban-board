import { useMemo } from 'react'
import {
  AddColumnButton,
  KanbanCard,
  KanbanCardPlaceholder,
  KanbanColumn,
  KanbanContainer,
  Layout,
} from '@/ui'
import { useListColumnsQuery } from './api/queries'

function App() {
  const { data: columns, isLoading: isLoadingColumns } = useListColumnsQuery({
    refetchOnMount: false,
  })

  const columnsData = useMemo(() => {
    if (!columns?.data) return []
    return [...columns.data]
      .sort((a, b) => a.order - b.order)
      .map((column) => ({
        ...column,
        cards: [...column.cards]
          .filter((card) => card.columnId === column.id)
          .sort((a, b) => a.order - b.order),
      }))
  }, [columns])

  if (isLoadingColumns) {
    return null
  }

  return (
    <Layout
      addColumnBtn={<AddColumnButton />}
      kanban={
        <KanbanContainer>
          {columnsData.map((column) => {
            return (
              <KanbanColumn key={column.id} {...column}>
                {column.cards.map((card, index) => (
                  <KanbanCard key={card.id} {...card} index={index} />
                ))}
                {/* 맨 마지막 drop */}
                <KanbanCardPlaceholder.ColumnPlaceholder
                  columnId={column.id}
                  columnCardCount={column.cards.length}
                />
              </KanbanColumn>
            )
          })}
        </KanbanContainer>
      }
    />
  )
}

export default App
