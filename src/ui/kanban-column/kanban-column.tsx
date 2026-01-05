export const KanbanColumn = ({
  state,
}: {
  state: 'todo' | 'in-progress' | 'done'
}) => {
  return <p>{state}</p>
}
