import type { TokenRequest, Response, NextFunction } from "express"
import ExpressError from "../lib/ExpressError.js"
import Campground from "../models/campground.js"

export default async function userAuthorized(
  req: TokenRequest,
  _: Response,
  next: NextFunction
) {
  const { id } = req.params
  const campground = await Campground.findById(id)
  if (!campground.author.equals(req.user?._id) && !req.user?.isAdmin)
    next(new ExpressError("You do not have permission to do that", 403))
  next()
}
