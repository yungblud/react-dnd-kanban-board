import { http, HttpResponse } from 'msw'
import { retrieveError, retrieveResponse, retrieveWithDelay } from '../utils'
import {
  CreateCardRequestBodySchema,
  HttpErrorCode,
  HttpStatus,
  MoveCardRequestBodySchema,
  UpdateCardRequestBodySchema,
} from '../types'
import { kanbanDb } from '../db/kanban'
import type { Card } from '@/types'

export const cardHandlers = [
  http.post('/api/cards', async ({ request }) => {
    try {
      const validation = CreateCardRequestBodySchema.safeParse(
        await request.json()
      )
      if (validation.error) {
        const errorResponse = retrieveError({
          code: HttpErrorCode.VALIDATION_ERROR,
          message: '카드 제목은 1~100자 이내로 입력해주세요.',
        })
        return HttpResponse.json(errorResponse, {
          status: HttpStatus.INVALID_REQUEST,
        })
      }
      const column = kanbanDb.getColumn({ id: validation.data.column_id })
      if (!column) {
        const errorResponse = retrieveError({
          code: HttpErrorCode.NOT_FOUND,
          message: '해당 컬럼 ID에 해당하는 컬럼이 존재하지 않습니다.',
        })
        return HttpResponse.json(errorResponse, {
          status: HttpStatus.NOT_FOUND,
        })
      }
      const newCard = kanbanDb.addCard(validation.data)
      const response = await retrieveWithDelay(retrieveResponse<Card>(newCard))
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
  http.patch('/api/cards/:id', async ({ params, request }) => {
    try {
      const id = params.id as string
      const validation = UpdateCardRequestBodySchema.safeParse(
        await request.json()
      )
      if (validation.error) {
        const errorResponse = retrieveError({
          code: HttpErrorCode.VALIDATION_ERROR,
          message: 'Body 데이터가 부합하지 않습니다.',
        })
        return HttpResponse.json(errorResponse, {
          status: HttpStatus.INVALID_REQUEST,
        })
      }
      const existing = kanbanDb.getCard({ id })
      if (!existing) {
        const errorResponse = retrieveError({
          code: HttpErrorCode.NOT_FOUND,
          message: '해당 ID를 가진 card가 없습니다.',
        })
        return HttpResponse.json(errorResponse, {
          status: HttpStatus.NOT_FOUND,
        })
      }
      const updatedCard = kanbanDb.updateCard({
        ...validation.data,
        id,
      })
      const response = await retrieveWithDelay(
        retrieveResponse<Card>(updatedCard)
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
  http.delete('/api/cards/:id', async ({ params }) => {
    try {
      const id = params.id as string
      const existing = kanbanDb.getCard({ id })
      if (!existing) {
        const errorResponse = retrieveError({
          code: HttpErrorCode.NOT_FOUND,
          message: '해당 ID를 가진 card가 없습니다.',
        })
        return HttpResponse.json(errorResponse, {
          status: HttpStatus.NOT_FOUND,
        })
      }

      kanbanDb.removeCard({ id })

      const response = await retrieveWithDelay(
        retrieveResponse<{ success: boolean }>({
          success: true,
        })
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
  http.patch('/api/cards/:id/move', async ({ params, request }) => {
    try {
      const id = params.id as string
      const validation = MoveCardRequestBodySchema.safeParse(
        await request.json()
      )
      if (validation.error) {
        const errorResponse = retrieveError({
          code: HttpErrorCode.VALIDATION_ERROR,
          message: 'Body 데이터가 부합하지 않습니다.',
        })
        return HttpResponse.json(errorResponse, {
          status: HttpStatus.INVALID_REQUEST,
        })
      }

      const existingCard = kanbanDb.getCard({ id })
      if (!existingCard) {
        const errorResponse = retrieveError({
          code: HttpErrorCode.NOT_FOUND,
          message: '해당 ID를 가진 card가 없습니다.',
        })
        return HttpResponse.json(errorResponse, {
          status: HttpStatus.NOT_FOUND,
        })
      }
      const existingColumn = kanbanDb.getColumn({
        id: validation.data.target_column_id,
      })
      if (!existingColumn) {
        const errorResponse = retrieveError({
          code: HttpErrorCode.NOT_FOUND,
          message: '해당 ID를 가진 column이 없습니다.',
        })
        return HttpResponse.json(errorResponse, {
          status: HttpStatus.NOT_FOUND,
        })
      }
      const movedCard = kanbanDb.moveCard({
        ...validation.data,
        id,
      })
      const response = await retrieveWithDelay(
        retrieveResponse<Card>(movedCard)
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
