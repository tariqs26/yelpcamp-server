import type { Request, Response, NextFunction } from "express"
import { NotAuthorizedError, NotFoundError } from "../lib/exceptions"
import Campground from "../models/campground"
import { getParamsId } from "../lib/utils"

export async function userAuthorized(
  req: Request,
  _: Response,
  next: NextFunction
) {
  try {
    const campground = await Campground.findById(getParamsId(req))
    if (!campground) throw new NotFoundError("Campground")
    if (!(campground.author.equals(req.user?._id) || req.user?.isAdmin))
      throw new NotAuthorizedError()
    next()
  } catch (err) {
    next(err)
  }
}
