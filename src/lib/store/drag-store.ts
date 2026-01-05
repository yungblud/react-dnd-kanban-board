import { create } from 'zustand'

export type DragState = {
  cardId: string
  fromColumnId: string
  pointerX: number
  pointerY: number
  offsetX: number
  offsetY: number

  overColumnId?: string
  overIndex?: number

  visible: boolean
} | null

type DragStore = {
  dragState: DragState
  initialize: (params: NonNullable<DragState>) => void
  reset: () => void
  move: (params: {
    pointerX: number
    pointerY: number
    overColumnId?: string
    overIndex?: number
  }) => void
}

export const useDragStore = create<DragStore>((set, get) => ({
  dragState: null,
  initialize: (params) => {
    set({
      dragState: params,
    })
  },
  reset: () => set({ dragState: null }),
  move: ({ pointerX, pointerY, overColumnId, overIndex }) => {
    const prevDragState = get().dragState
    if (!prevDragState) return
    set({
      dragState: {
        ...prevDragState,
        pointerX,
        pointerY,
        overColumnId,
        overIndex,
        visible: true,
      },
    })
  },
}))
