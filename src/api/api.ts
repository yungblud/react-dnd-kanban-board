import {
  CardSchema,
  ColumnSchema,
  ColumnWithCardSchema,
  createHttpResponseSchema,
} from '@/types/schema'
import { ApiError } from './api.error'
import { z } from 'zod'
import type { Card } from '@/types'

const baseURL = 'http://localhost:5173/api'

const fetchColumns = async () => {
  return await withThrowApiError(async () => {
    const response = await fetch(`${baseURL}/columns`, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new ApiError({
        message: `Server Error: error code ${response.status}`,
        code: response.status,
      })
    }

    const json = await response.json()

    const validation = createHttpResponseSchema(
      z.array(ColumnWithCardSchema)
    ).safeParse(json)

    if (validation.error) {
      console.error(validation.error)
      throw new ApiError({
        message: 'schema parse failed',
        code: 500,
      })
    }

    return validation.data
  })
}

const createColumn = async ({ title }: { title: string }) => {
  return await withThrowApiError(async () => {
    const response = await fetch('/api/columns', {
      method: 'POST',
      body: JSON.stringify({
        title,
      }),
    })

    if (!response.ok) {
      throw new ApiError({
        message: `Server Error: error code ${response.status}`,
        code: response.status,
      })
    }

    const json = await response.json()

    const validation = createHttpResponseSchema(ColumnSchema).safeParse(json)

    if (validation.error) {
      console.error(validation.error)
      throw new ApiError({
        message: 'schema parse failed',
        code: 500,
      })
    }

    return validation.data
  })
}

const updateColumn = async ({ id, title }: { id: string; title: string }) => {
  return await withThrowApiError(async () => {
    const response = await fetch(`/api/columns/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        title,
      }),
    })

    if (!response.ok) {
      throw new ApiError({
        message: `Server Error: error code ${response.status}`,
        code: response.status,
      })
    }

    const json = await response.json()

    const validation = createHttpResponseSchema(ColumnSchema).safeParse(json)

    if (validation.error) {
      console.error(validation.error)
      throw new ApiError({
        message: 'schema parse failed',
        code: 500,
      })
    }

    return validation.data
  })
}

const removeColumn = async ({ id }: { id: string }) => {
  return await withThrowApiError(async () => {
    const response = await fetch(`/api/columns/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new ApiError({
        message: `Server Error: error code ${response.status}`,
        code: response.status,
      })
    }

    const json = await response.json()

    const validation = createHttpResponseSchema(
      z.object({
        success: z.boolean(),
        deleted_cards_count: z.number(),
      })
    ).safeParse(json)

    if (validation.error) {
      console.error(validation.error)
      throw new ApiError({
        message: 'schema parse failed',
        code: 500,
      })
    }

    return validation.data
  })
}

const createCard = async ({
  columnId,
  title,
  description,
  dueDate,
}: Pick<Card, 'columnId' | 'title' | 'description' | 'dueDate'>) => {
  return await withThrowApiError(async () => {
    const response = await fetch(`/api/cards`, {
      method: 'POST',
      body: JSON.stringify({
        column_id: columnId,
        title,
        description,
        due_date: dueDate,
      }),
    })

    if (!response.ok) {
      throw new ApiError({
        message: `Server Error: error code ${response.status}`,
        code: response.status,
      })
    }

    const json = await response.json()

    const validation = createHttpResponseSchema(CardSchema).safeParse(json)

    if (validation.error) {
      console.error(validation.error)
      throw new ApiError({
        message: 'schema parse failed',
        code: 500,
      })
    }

    return validation.data
  })
}

async function withThrowApiError<T>(fetchFunc: () => Promise<T>): Promise<T> {
  try {
    return await fetchFunc()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error // 그대로 전달
    }

    // fetch 자체 에러 (네트워크, CORS 등)
    throw new ApiError({
      message: 'Network Error',
      code: 500,
    })
  }
}

export const api = {
  fetchColumns,
  createColumn,
  updateColumn,
  removeColumn,
  createCard,
}
