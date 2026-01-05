import { http, HttpResponse } from 'msw'
import { mockData } from '../data'
import { retrieveResponse } from '../utils'
import { HttpStatus } from '../types'
import type { ColumnWithCard } from '@/types'

export const columnHandlers = [
  http.get('/api/columns', () => {
    return HttpResponse.json(
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
      ),
      {
        status: HttpStatus.SUCCESS,
      }
    )
  }),
]
