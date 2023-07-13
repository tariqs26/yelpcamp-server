import type { Request, Response, NextFunction } from "express"
import { MongooseError} from "mongoose"

export default function handleErrors(
  err: { status?: number; message: string },
  _: Request,
  res: Response,
  __: NextFunction
) {
  let status = err.status || 500
  let message = err.message || "Something went wrong"
  if (err instanceof MongooseError) {
    switch (err.name) {
      case "CastError":
        status = 400
        message = "Invalid ObjectId"
        break
    }
  }
  return res.status(status || 500).send(message || "Something went wrong")
}
