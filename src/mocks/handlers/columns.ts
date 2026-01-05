import { http, HttpResponse } from 'msw'
import { mockData } from '../data'

export const columnHandlers = [
  http.get('/api/columns', () => {
    return HttpResponse.json(mockData.initialColumns)
  }),
]
