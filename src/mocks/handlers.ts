import { cardHandlers } from './handlers/cards'
import { columnHandlers } from './handlers/columns'

export const handlers = [...columnHandlers, ...cardHandlers]
