import type { z } from 'zod'
import type { CardSchema, ColumnSchema, ColumnWithCardSchema } from './schema'

export type Column = z.infer<typeof ColumnSchema>

export type ColumnWithCard = z.infer<typeof ColumnWithCardSchema>

export type Card = z.infer<typeof CardSchema>

export type HttpResponse<T> = {
  data: T
}
