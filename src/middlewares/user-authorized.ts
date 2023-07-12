import type { Request, Response, NextFunction } from "express"
import ExpressError from "../lib/express-error"
import Campground from "../models/campground"

export default async function userAuthorized(
  req: Request,
  _: Response,
  next: NextFunction
) {
  const { id } = req.params
  const campground = await Campground.findById(id)
  if (!campground) throw new ExpressError("Campground not found", 404)
  if (!(campground.author.equals(req.user?._id) || req.user?.isAdmin))
    throw new ExpressError("You do not have permission to do that", 403)
  next()
}
