import type { NextFunction, Request, Response } from "express"

export default function errorHandler(
  error: {
    status?: number
    message: string
  },
  _: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) return next(error)

  const status = error.status ?? 500
  const message = error.message ?? "Something went wrong"

  res.status(status).send(message)
}
