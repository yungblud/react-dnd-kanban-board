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

export const uuid = (): string => {
  // 브라우저/Node 19+ 지원
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID()
  }

  // fallback (RFC4122 v4 형태)
  const bytes = new Uint8Array(16)
  globalThis.crypto.getRandomValues(bytes)

  bytes[6] = (bytes[6] & 0x0f) | 0x40 // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80 // variant

  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}
