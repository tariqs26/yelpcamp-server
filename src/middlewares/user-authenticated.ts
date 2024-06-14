import type { NextFunction, Request, Response } from "express"
import { NotAuthenticatedError } from "../lib/exceptions"

export default function userAuthenticated(
  req: Request,
  _: Response,
  next: NextFunction
) {
  if (req.user === undefined) return next(new NotAuthenticatedError())
  next()
}
