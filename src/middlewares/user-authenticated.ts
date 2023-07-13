import type { Request, Response, NextFunction } from "express"
import { NotAuthenticatedError } from "../lib/exceptions"

export default function userAuthenticated(
  req: Request,
  _: Response,
  next: NextFunction
) {
  if (!req.user) throw new NotAuthenticatedError()
  next()
}
