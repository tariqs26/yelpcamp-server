import type { RequestHandler } from "express"
import { NotAuthenticatedError } from "../lib/exceptions"

export const userAuthenticated: RequestHandler = async (req, _res, next) => {
  if (req.user === undefined) return next(new NotAuthenticatedError())
  next()
}
