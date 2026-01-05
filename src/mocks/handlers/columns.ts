import { http, HttpResponse } from 'msw'
import { mockData } from '../data'
import { retrieveResponse, retrieveWithDelay } from '../utils'
import { HttpStatus } from '../types'
import type { ColumnWithCard } from '@/types'

export const columnHandlers = [
  http.get('/api/columns', async () => {
    const response = await retrieveWithDelay(
      retrieveResponse<ColumnWithCard[]>(
        mockData.initialColumns.map((column) => ({
          ...column,
          createdAt: new Date().toISOString(),
          cards: mockData.initialCards.map((card) => ({
            ...card,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })),
        }))
      )
    )
    return HttpResponse.json(response, {
      status: HttpStatus.SUCCESS,
    })
  }),
]
