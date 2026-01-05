import { z } from 'zod'

export const ColumnSchema = z.object({
  id: z.string(),
  title: z.string(),
  order: z.number(),
  createdAt: z.string().datetime(),
})

export const CardSchema = z.object({
  id: z.string(),
  columnId: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  dueDate: z.string().datetime().nullable(),
  order: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const ColumnWithCardSchema = ColumnSchema.extend({
  cards: CardSchema.array(),
})

export const createHttpResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) =>
  z.object({
    data: dataSchema,
  })
