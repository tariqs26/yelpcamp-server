class ExpressError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export class NotAuthenticatedError extends ExpressError {
  constructor(message: string = "Please login to access this feature") {
    super(message, 401)
  }
}

export class NotAuthorizedError extends ExpressError {
  constructor(
    message: string = "You are not authorized to access this feature"
  ) {
    super(message, 403)
  }
}

export class NotFoundError extends ExpressError {
  /**
   * @description
   * 404 Not Found
   * @param message - Model name
   */
  constructor(message: string) {
    super(message + " not found", 404)
  }
}

export class BadRequestError extends ExpressError {
  constructor(message: string) {
    super(message, 400)
  }
}
