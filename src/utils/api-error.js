export class APIError extends Error {
  constructor(message, code = 400) {
    super(message)

    this.code = code
  }
}