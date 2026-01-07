import {
  queryKeys,
  useCreateColumnMutation,
  useUpdateColumnMutation,
} from '@/api/queries'
import type { ColumnWithCard, HttpResponse } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

export type ColumnTitleForm = {
  title: string
}

type Params =
  | {
      mode: 'create'
    }
  | {
      mode: 'edit'
      editId: string
    }

export function useColumnTitleForm(params: Params) {
  const form = useForm<ColumnTitleForm>({
    mode: 'onChange',
  })

  const queryClient = useQueryClient()
  const { mutate: createColumn, isPending: isPendingCreateColumn } =
    useCreateColumnMutation({
      onMutate: async (variables) => {
        await queryClient.cancelQueries({
          queryKey: queryKeys.column.list(),
        })

        const prevData = queryClient.getQueryData<
          HttpResponse<ColumnWithCard[]>
        >(queryKeys.column.list())

        const newColumn = {
          cards: [],
          createdAt: new Date().toISOString(),
          id: crypto.randomUUID(),
          order: prevData?.data ? (prevData.data.at(-1)?.order ?? 0) + 1 : 1,
          title: variables.title,
        }

        const newData: HttpResponse<ColumnWithCard[]> = {
          ...prevData,
          data: prevData?.data ? prevData.data.concat(newColumn) : [newColumn],
        }

        queryClient.setQueryData(queryKeys.column.list(), newData)

        return {
          prevData,
          newData,
        }
      },
      onError: (error, variables, ctx) => {
        if (ctx?.prevData) {
          queryClient.setQueryData(queryKeys.column.list(), ctx.prevData)
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.column.list(),
        })
      },
    })

  const { mutate: updateColumn, isPending: isPendingUpdateColumn } =
    useUpdateColumnMutation({
      onMutate: async (variables) => {
        await queryClient.cancelQueries({
          queryKey: queryKeys.column.list(),
        })
        const prevData = queryClient.getQueryData<
          HttpResponse<ColumnWithCard[]>
        >(queryKeys.column.list())

        const newData: HttpResponse<ColumnWithCard[]> = {
          ...prevData,
          data: prevData?.data
            ? prevData.data.map((value) => {
                if (value.id === variables.id) {
                  return {
                    ...value,
                    title: variables.title,
                  }
                }
                return value
              })
            : [],
        }

        queryClient.setQueryData(queryKeys.column.list(), newData)

        return {
          newData,
          prevData,
        }
      },
      onError: (error, variables, ctx) => {
        if (ctx?.prevData) {
          queryClient.setQueryData(queryKeys.column.list(), ctx.prevData)
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.column.list(),
        })
      },
    })

  const onSubmit = useCallback(
    (values: ColumnTitleForm) => {
      if (params.mode === 'edit') {
        if (isPendingUpdateColumn || !form.formState.isDirty) return
        updateColumn({
          id: params.editId,
          title: values.title,
        })
      }
      if (params.mode === 'create') {
        if (isPendingCreateColumn) return

        createColumn({ title: values.title })
      }
    },
    [
      createColumn,
      form.formState.isDirty,
      isPendingCreateColumn,
      isPendingUpdateColumn,
      params,
      updateColumn,
    ]
  )

  return {
    form,
    register: () =>
      form.register('title', {
        required: '제목을 입력해주세요',
        validate: (value) =>
          !!value.split(' ').join('') || '공백만으로는 생성할 수 없습니다',
      }),
    onSubmit,
    isPendingCreateColumn,
    isPendingUpdateColumn,
  }
}
