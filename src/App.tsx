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

  const isEmptyColumns = useMemo(
    () => !isLoadingColumns && columns?.data.length === 0,
    [columns?.data.length, isLoadingColumns]
  )

  if (isLoadingColumns) {
    return null
  }

  return (
    <Layout
      isEmpty={isEmptyColumns}
      addColumnBtn={<AddColumnButton />}
      kanban={
        <KanbanContainer>
          {columnsData.map((column) => {
            const isEmpty = column.cards.length === 0
            return (
              <KanbanColumn key={column.id} {...column}>
                {isEmpty ? (
                  <div
                    style={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <p>아래 버튼으로 카드를 추가해보세요</p>
                  </div>
                ) : (
                  column.cards.map((card, index) => (
                    <KanbanCard key={card.id} {...card} index={index} />
                  ))
                )}
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
