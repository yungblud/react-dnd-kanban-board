import { useMemo } from 'react'
import { KanbanColumn, KanbanContainer, Layout } from '@/ui'
import { useListColumnsQuery } from './api/queries'

function App() {
  const { data: columns, isLoading: isLoadingColumns } = useListColumnsQuery()

  const columnsData = useMemo(() => columns?.data ?? [], [columns?.data])

  if (isLoadingColumns) {
    return null
  }

  return (
    <Layout>
      <KanbanContainer>
        {[...columnsData]
          .sort((a, b) => a.order - b.order)
          .map((column) => {
            const cards = [...column.cards]
              .filter((card) => card.columnId === column.id)
              .sort((a, b) => a.order - b.order)
            return (
              <KanbanColumn key={column.id} {...column}>
                {cards.map((card) => (
                  <div key={card.id}>{card.title}</div>
                ))}
              </KanbanColumn>
            )
          })}
      </KanbanContainer>
    </Layout>
  )
}

export default App
