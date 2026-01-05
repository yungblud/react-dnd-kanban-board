type NetworkErrorCode = number

export class ApiError extends Error {
  code: NetworkErrorCode
  constructor(error: { message: string; code: NetworkErrorCode }) {
    super(error.message)
    this.message = error.message
    this.code = error.code
    Object.setPrototypeOf(this, ApiError.prototype) // Ensures instanceof works correctly
  }
}
