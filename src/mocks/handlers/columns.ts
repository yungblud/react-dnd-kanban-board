import { http, HttpResponse } from 'msw'
import { mockData } from '../data'
import { retrieveResponse } from '../utils'
import { HttpStatus } from '../types'

export const columnHandlers = [
  http.get('/api/columns', () => {
    return HttpResponse.json(retrieveResponse(mockData.initialColumns), {
      status: HttpStatus.SUCCESS,
    })
  }),
]
