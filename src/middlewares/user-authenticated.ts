import type { Request, Response, NextFunction } from "express"
import ExpressError from "../lib/express-error"

export default function userAuthenticated(
  req: Request,
  _: Response,
  next: NextFunction
) {
  if (!req.user)
    throw new ExpressError("Please login to access this feature", 401)
  next()
}
