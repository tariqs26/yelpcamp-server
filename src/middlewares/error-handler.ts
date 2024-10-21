import type { ErrorRequestHandler } from "express"

export const errorHandler: ErrorRequestHandler = async (
  error: {
    status?: number
    message: string
  },
  _req,
  res,
  next
) => {
  if (res.headersSent) return next(error)

  const status = error.status ?? 500
  const message = error.message ?? "Something went wrong"

  res.status(status).send(message)
}
