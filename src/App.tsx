import { useEffect, useState } from 'react'
import { KanbanColumn, KanbanContainer, Layout } from '@/ui'
import type { ColumnWithCard } from './types'
import { api } from './api'

function App() {
  const [columns, setColumns] = useState<ColumnWithCard[]>([])
  useEffect(() => {
    api.fetchColumns().then((data) => {
      setColumns(data.data)
    })
  }, [])

  return (
    <Layout>
      <KanbanContainer>
        {[...columns]
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
