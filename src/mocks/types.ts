import { z } from 'zod'

export const HttpStatus = {
  SUCCESS: 200,
  CREATE_SUCCESS: 201,
  INVALID_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const

export const HttpErrorCode = {
  INVALID_REQUEST: 'INVALID_REQUEST',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
} as const

export const CreateOrUpdateColumnRequestBodySchema = z.object({
  title: z.string(),
})

export const CreateCardRequestBodySchema = z.object({
  column_id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  due_date: z.string().datetime().nullable(),
})

export const UpdateCardRequestBodySchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  due_date: z.string().datetime().optional(),
})

export const MoveCardRequestBodySchema = z.object({
  target_column_id: z.string(),
  new_order: z.number(),
})
