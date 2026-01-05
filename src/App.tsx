import { mockData } from './mocks/data'
import { KanbanColumn, KanbanContainer, Layout } from './ui'

const data = {
  columns: mockData.initialColumns,
  cards: mockData.initialCards,
}

function App() {
  return (
    <Layout>
      <KanbanContainer>
        {[...data.columns]
          .sort((a, b) => a.order - b.order)
          .map((column) => {
            const cards = [...data.cards]
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
