import { http, HttpResponse } from 'msw'
import { retrieveError, retrieveResponse, retrieveWithDelay } from '../utils'
import {
  CreateCardRequestBodySchema,
  HttpErrorCode,
  HttpStatus,
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
]
