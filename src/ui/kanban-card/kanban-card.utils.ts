export function getTargetColumn(x: number, y: number): HTMLElement | null {
  const columns = document.querySelectorAll<HTMLElement>('[data-column-id]')

  for (const col of columns) {
    const rect = col.getBoundingClientRect()
    if (
      x >= rect.left &&
      x <= rect.right &&
      y >= rect.top &&
      y <= rect.bottom
    ) {
      return col
    }
  }
  return null
}

export function getInsertIndex(columnEl: HTMLElement, pointerY: number) {
  const cards = Array.from(
    columnEl.querySelectorAll<HTMLElement>('[data-card-id]')
  )

  for (let i = 0; i < cards.length; i++) {
    const rect = cards[i].getBoundingClientRect()
    if (pointerY < rect.top + rect.height / 2) {
      return i
    }
  }

  return cards.length
}
