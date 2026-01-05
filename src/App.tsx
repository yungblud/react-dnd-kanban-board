import { KanbanColumn, KanbanContainer } from './ui'

const columnsState = ['todo', 'in-progress', 'done'] as const

function App() {
  return (
    <KanbanContainer>
      {columnsState.map((item) => (
        <KanbanColumn key={item} state={item} />
      ))}
    </KanbanContainer>
  )
}

export default App
