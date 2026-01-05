import { KanbanColumn } from './ui'

const columnsState = ['todo', 'in-progress', 'done'] as const

function App() {
  return (
    <div>
      {columnsState.map((item) => (
        <KanbanColumn key={item} state={item} />
      ))}
    </div>
  )
}

export default App
