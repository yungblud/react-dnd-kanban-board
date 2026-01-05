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

function randomInt(min: number, max: number): number {
  if (min > max) {
    throw new Error('min must be less than or equal to max')
  }
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const retrieveWithDelay = async <T>(
  response: ReturnType<typeof retrieveResponse<T>>,
  sleepTime?: number
) => {
  const sleepAndRetrieve = () => {
    return new Promise<ReturnType<typeof retrieveResponse<T>>>((resolve) =>
      setTimeout(
        () => resolve(response),
        sleepTime ? sleepTime : randomInt(200, 500)
      )
    )
  }
  return await sleepAndRetrieve()
}
