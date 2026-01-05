import { http, HttpResponse } from 'msw'
import { mockData } from '../data'
import { retrieveResponse } from '../utils'

export const columnHandlers = [
  http.get('/api/columns', () => {
    return HttpResponse.json(retrieveResponse(mockData.initialColumns))
  }),
]
