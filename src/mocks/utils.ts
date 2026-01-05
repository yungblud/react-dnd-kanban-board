import type { HttpErrorCode } from './types'

export const retrieveResponse = <T>(data: T) => {
  return {
    data,
  }
}

export const retrieveError = ({
  code,
  message,
}: {
  code: (typeof HttpErrorCode)[keyof typeof HttpErrorCode]
  message: string
}) => {
  return {
    error: {
      code,
      message,
    },
  }
}
