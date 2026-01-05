export type Column = {
  id: string
  title: string
  order: number
}

export type Card = {
  id: string
  columnId: string
  title: string
  description: string
  dueDate: string | null
  order: number
}
