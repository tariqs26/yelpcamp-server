import type { TokenRequest, Response, NextFunction } from "express"
import ExpressError from "../lib/ExpressError.js"

export default function userLoggedIn(
  req: TokenRequest,
  _: Response,
  next: NextFunction
) {
  if (!req.user)
    throw new ExpressError("Please login to access this feature", 401)
  next()
}
