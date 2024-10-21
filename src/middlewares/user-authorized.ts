import type { RequestHandler } from "express"
import { NotAuthorizedError, NotFoundError } from "../lib/exceptions"
import { getParamsId } from "../lib/utils"
import Campground from "../models/campground"

export const userAuthorized: RequestHandler = async (req, _res, next) => {
  try {
    const campground = await Campground.findById(getParamsId(req))
    if (!campground) throw new NotFoundError("Campground")
    if (!(campground.author.equals(req.user?._id) || req.user?.isAdmin))
      throw new NotAuthorizedError()
    next()
  } catch (error) {
    next(error)
  }
}
