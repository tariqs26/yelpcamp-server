import type { NextFunction, Request, Response } from "express"
import { MongooseError } from "mongoose"

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

  let status = error.status ?? 500
  let message = error.message ?? "Something went wrong"
  if (error instanceof MongooseError) {
    switch (error.name) {
      case "CastError":
        status = 400
        message = "Invalid ObjectId"
        break
    }
  }

  res.status(status).send(message)
}
