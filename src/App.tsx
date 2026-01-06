import { useMemo } from 'react'
import {
  AddColumnButton,
  KanbanCard,
  KanbanColumn,
  KanbanContainer,
  Layout,
} from '@/ui'
import {
  queryKeys,
  useCreateCardMutation,
  useListColumnsQuery,
  useRemoveColumnMutation,
} from './api/queries'
import { useQueryClient } from '@tanstack/react-query'

function App() {
  const queryClient = useQueryClient()
  const { data: columns, isLoading: isLoadingColumns } = useListColumnsQuery()

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

  const columnsData = useMemo(() => columns?.data ?? [], [columns?.data])

  if (isLoadingColumns) {
    return null
  }

  return (
    <Layout
      addColumnBtn={<AddColumnButton />}
      kanban={
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
                  // @TODO: enhance this prop
                  cards={cards}
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
                  {cards.map((card, index) => (
                    // @TODO: enhance index prop
                    <KanbanCard key={card.id} {...card} index={index} />
                  ))}
                </KanbanColumn>
              )
            })}
        </KanbanContainer>
      }
    />
  )
}

export default App
