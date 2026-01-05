import { memo } from 'react'

export const KanbanColumn = memo(
  ({ state }: { state: 'todo' | 'in-progress' | 'done' }) => {
    return <p>{state}</p>
  }
)
