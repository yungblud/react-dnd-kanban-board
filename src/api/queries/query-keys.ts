export const queryKeys = {
  column: {
    all: ['column'] as const,
    list: () => [...queryKeys.column.all, 'list'],
  },
}
