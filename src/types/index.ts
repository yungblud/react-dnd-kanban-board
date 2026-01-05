export type Column = {
  id: string // UUID 형식 권장 (예: "col_a1b2c3d4")
  title: string // 컬럼 제목, 1~50자
  order: number // 정렬 순서, 0부터 시작
  createdAt: string // ISO 8601 형식 (예: "2025-01-10T09:00:00Z")
}

export interface ColumnWithCard extends Column {
  cards: Card[]
}

export type Card = {
  id: string // UUID 형식 권장 (예: "card_x1y2z3")
  columnId: string // 소속 컬럼 ID
  title: string // 카드 제목, 1~100자
  description: string // 카드 설명, 0~1000자
  dueDate: string | null // 마감일, ISO 8601 형식 또는 null
  order: number // 컬럼 내 정렬 순서, 0부터 시작
  createdAt: string // 생성일, ISO 8601 형식
  updatedAt: string // 수정일, ISO 8601 형식
}

export type HttpResponse<T> = {
  data: T
}
