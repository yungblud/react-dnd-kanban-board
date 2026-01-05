import { useMemo } from 'react'
import { KanbanColumn, KanbanContainer, Layout } from '@/ui'
import {
  queryKeys,
  useCreateColumnMutation,
  useListColumnsQuery,
  useUpdateColumnMutation,
} from './api/queries'
import { useQueryClient } from '@tanstack/react-query'

function App() {
  const queryClient = useQueryClient()
  const { data: columns, isLoading: isLoadingColumns } = useListColumnsQuery()
  // @TODO: implement optimistic update
  const { mutate: createColumn, isPending: isPendingCreateColumn } =
    useCreateColumnMutation({
      onSuccess: () => {
        console.log('success')
        queryClient.invalidateQueries({
          queryKey: queryKeys.column.list(),
        })
      },
    })
  // @TODO: implement optimistic update
  const { mutate: updateColumn, isPending: isPendingUpdateColumn } =
    useUpdateColumnMutation({
      onSuccess: () => {
        console.log('success')
        queryClient.invalidateQueries({
          queryKey: queryKeys.column.list(),
        })
      },
    })

  const columnsData = useMemo(() => columns?.data ?? [], [columns?.data])

  if (isLoadingColumns) {
    return null
  }

  return (
    <Layout>
      <button
        onClick={() => {
          if (isPendingCreateColumn) return
          createColumn({ title: 'Mock Title' })
        }}
      >
        컬럼 추가
      </button>
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
                onClickUpdate={() => {
                  if (isPendingUpdateColumn) return
                  updateColumn({
                    id: column.id,
                    title: 'Mock Update Title',
                  })
                }}
              >
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
