import { KanbanColumn, KanbanContainer, Layout } from './ui'

const columnsState = ['todo', 'in-progress', 'done'] as const

function App() {
  return (
    <Layout>
      <KanbanContainer>
        {columnsState.map((item) => (
          <KanbanColumn key={item} state={item} />
        ))}
      </KanbanContainer>
    </Layout>
  )
}

export default App
