export class AppServiceError extends Error {
  readonly status: number
  readonly code: string

  constructor(input: { status: number; code: string; message: string }) {
    super(input.message)
    this.name = 'AppServiceError'
    this.status = input.status
    this.code = input.code
  }
}