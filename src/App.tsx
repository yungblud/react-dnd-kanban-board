import { useMemo } from 'react'
import { KanbanColumn, KanbanContainer, Layout } from '@/ui'
import {
  queryKeys,
  useCreateCardMutation,
  useCreateColumnMutation,
  useListColumnsQuery,
  useRemoveCardMutation,
  useRemoveColumnMutation,
  useUpdateCardMutation,
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
  // @TODO: implement optimistic update
  const { mutate: removeColumn, isPending: isPendingRemoveColumn } =
    useRemoveColumnMutation({
      onSuccess: () => {
        console.log('success')
        queryClient.invalidateQueries({
          queryKey: queryKeys.column.list(),
        })
      },
    })
  // @TODO: implement optimistic update
  const { mutate: createCard, isPending: isPendingCreateCard } =
    useCreateCardMutation({
      onSuccess: () => {
        console.log('success')
        queryClient.invalidateQueries({
          queryKey: queryKeys.column.list(),
        })
      },
    })
  // @TODO: implement optimistic update
  const { mutate: updateCard, isPending: isPendingUpdateCard } =
    useUpdateCardMutation({
      onSuccess: () => {
        console.log('success')
        queryClient.invalidateQueries({
          queryKey: queryKeys.column.list(),
        })
      },
    })
  // @TODO: implement optimistic update
  const { mutate: removeCard, isPending: isPendingRemoveCard } =
    useRemoveCardMutation({
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
                onClickRemove={() => {
                  if (isPendingRemoveColumn) return
                  removeColumn({
                    id: column.id,
                  })
                }}
                onClickAddCard={() => {
                  if (isPendingCreateCard) return
                  createCard({
                    columnId: column.id,
                    description: 'Mock Create Card Description',
                    dueDate: new Date('2026-02-03').toISOString(),
                    title: 'Mock Create Card Title',
                  })
                }}
              >
                {cards.map((card) => (
                  <div key={card.id}>
                    {card.title}
                    <button
                      onClick={() => {
                        if (isPendingUpdateCard) return
                        updateCard({
                          id: card.id,
                          title: 'Mock Update Card Title',
                        })
                      }}
                    >
                      Update Card
                    </button>
                    <button
                      onClick={() => {
                        if (isPendingRemoveCard) return
                        removeCard({
                          id: card.id,
                        })
                      }}
                    >
                      Remove Card
                    </button>
                  </div>
                ))}
              </KanbanColumn>
            )
          })}
      </KanbanContainer>
    </Layout>
  )
}

export default App
