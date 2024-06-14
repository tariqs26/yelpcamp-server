import type { NextFunction, Request, Response } from "express"
import { NotAuthenticatedError } from "../lib/exceptions"

export function userAuthenticated(
  req: Request,
  _: Response,
  next: NextFunction
) {
  if (req.user === undefined) throw new NotAuthenticatedError()
  next()
}
