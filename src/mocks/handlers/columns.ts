import { http, HttpResponse } from 'msw'
import { retrieveError, retrieveResponse, retrieveWithDelay } from '../utils'
import {
  CreateOrUpdateColumnRequestBodySchema,
  HttpErrorCode,
  HttpStatus,
} from '../types'
import { type Column, type ColumnWithCard } from '@/types'
import { kanbanDb } from '../db/kanban'

export const columnHandlers = [
  http.get('/api/columns', async () => {
    try {
      const data = kanbanDb.listColumns()
      const response = await retrieveWithDelay(
        retrieveResponse<ColumnWithCard[]>(
          data.map((column) => ({
            ...column,
            cards: kanbanDb.listCards({ columnId: column.id }),
          }))
        )
      )
      return HttpResponse.json(response, {
        status: HttpStatus.SUCCESS,
      })
    } catch (e) {
      console.error(e)
      const errorResponse = retrieveError({
        code: HttpErrorCode.INTERNAL_SERVER_ERROR,
        message: 'internal server error',
      })
      return HttpResponse.json(errorResponse, {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      })
    }
  }),
  http.post('/api/columns', async ({ request }) => {
    try {
      const validation = CreateOrUpdateColumnRequestBodySchema.safeParse(
        await request.json()
      )
      if (validation.error) {
        const errorResponse = retrieveError({
          code: HttpErrorCode.VALIDATION_ERROR,
          message: '컬럼 제목은 필수입니다.',
        })
        return HttpResponse.json(errorResponse, {
          status: HttpStatus.INVALID_REQUEST,
        })
      }
      const { title } = validation.data
      const newColumns = kanbanDb.addColumn({ title })
      const added = newColumns[0]
      const response = await retrieveWithDelay(retrieveResponse<Column>(added))
      return HttpResponse.json(response, {
        status: HttpStatus.CREATE_SUCCESS,
      })
    } catch (e) {
      console.error(e)
      const errorResponse = retrieveError({
        code: HttpErrorCode.INTERNAL_SERVER_ERROR,
        message: 'internal server error',
      })
      return HttpResponse.json(errorResponse, {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      })
    }
  }),
  http.patch('/api/:id', async ({ params, request }) => {
    try {
      const id = params.id as string
      const validation = CreateOrUpdateColumnRequestBodySchema.safeParse(
        await request.json()
      )
      if (validation.error) {
        const errorResponse = retrieveError({
          code: HttpErrorCode.VALIDATION_ERROR,
          message: '컬럼 제목은 필수입니다.',
        })
        return HttpResponse.json(errorResponse, {
          status: HttpStatus.INVALID_REQUEST,
        })
      }
      const existing = kanbanDb.getColumn({ id })
      if (!existing) {
        const errorResponse = retrieveError({
          code: HttpErrorCode.NOT_FOUND,
          message: '해당 컬럼을 찾을 수 없습니다.',
        })
        return HttpResponse.json(errorResponse, {
          status: HttpStatus.NOT_FOUND,
        })
      }
      const updated = kanbanDb.updateColumn({
        id,
        title: validation.data.title,
      })
      if (!updated) {
        const errorResponse = retrieveError({
          code: HttpErrorCode.NOT_FOUND,
          message: '해당 컬럼을 찾을 수 없습니다.',
        })
        return HttpResponse.json(errorResponse, {
          status: HttpStatus.NOT_FOUND,
        })
      }
      const response = await retrieveWithDelay(
        retrieveResponse<Column>(updated)
      )
      return HttpResponse.json(response, {
        status: HttpStatus.SUCCESS,
      })
    } catch (e) {
      console.error(e)
      const errorResponse = retrieveError({
        code: HttpErrorCode.INTERNAL_SERVER_ERROR,
        message: 'internal server error',
      })
      return HttpResponse.json(errorResponse, {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      })
    }
  }),
]
