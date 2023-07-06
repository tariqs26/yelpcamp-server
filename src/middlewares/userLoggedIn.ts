import type { Request, Response, NextFunction } from "express"
import ExpressError from "../lib/ExpressError.js"

export default function userLoggedIn(
  req: Request,
  _: Response,
  next: NextFunction
) {
  if (!req.user)
    throw new ExpressError("Please login to access this feature", 401)
  next()
}
