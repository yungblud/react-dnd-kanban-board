import { useMemo } from 'react'
import {
  AddColumnButton,
  KanbanCard,
  KanbanColumn,
  KanbanContainer,
  Layout,
} from '@/ui'
import { useListColumnsQuery } from './api/queries'

function App() {
  const { data: columns, isLoading: isLoadingColumns } = useListColumnsQuery({
    refetchOnMount: false,
  })

  const columnsData = useMemo(() => columns?.data ?? [], [columns?.data])

  if (isLoadingColumns) {
    return null
  }

  return (
    <Layout
      addColumnBtn={<AddColumnButton />}
      kanban={
        <KanbanContainer>
          {[...columnsData]
            .sort((a, b) => a.order - b.order)
            .map((column) => {
              const cards = [...column.cards]
                .filter((card) => card.columnId === column.id)
                .sort((a, b) => a.order - b.order)
              return (
                <KanbanColumn
                  key={column.id}
                  {...column}
                  // @TODO: enhance this prop
                  cards={cards}
                >
                  {cards.map((card, index) => (
                    // @TODO: enhance index prop
                    <KanbanCard key={card.id} {...card} index={index} />
                  ))}
                </KanbanColumn>
              )
            })}
        </KanbanContainer>
      }
    />
  )
}

export default App
