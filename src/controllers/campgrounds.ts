import type { Request, Response } from "express"
import { NotFoundError } from "../lib/exceptions"
import { getGeoDataGeometry } from "../lib/geocoder"
import { campgroundSchema } from "../lib/schemas"
import { getParamsId } from "../lib/utils"
import { validate } from "../lib/validate"
import Campground from "../models/campground"

export const getCampgrounds = async (req: Request, res: Response) => {
  const { page = 1 } = req.query
  const PER_PAGE = 5
  const total = await Campground.countDocuments()

  res.send({
    total,
    totalPages: Math.ceil(total / PER_PAGE),
    campgrounds: await Campground.find({})
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * PER_PAGE)
      .limit(PER_PAGE),
  })
}

export const createCampground = async (req: Request, res: Response) => {
  const body = validate(req.body, campgroundSchema)
  const geometry = await getGeoDataGeometry(body.location)

  const campground = new Campground(body)
  campground.geometry = geometry
  campground.author = req.user?._id

  await campground.save()

  res.send(campground)
}

export const getCampground = async (req: Request, res: Response) => {
  const campground = await Campground.findById(getParamsId(req))
  if (!campground) throw new NotFoundError("Campground")

  const populateReviews = await campground.populate({
    path: "reviews",
    populate: { path: "author", select: "_id username isAdmin" },
  })

  res.send(await populateReviews.populate("author", "_id username isAdmin"))
}

export const updateCampground = async (req: Request, res: Response) => {
  const body = validate(req.body, campgroundSchema)
  const geometry = await getGeoDataGeometry(body.location)

  const campground = await Campground.findByIdAndUpdate(
    getParamsId(req),
    { ...body, geometry },
    { new: true }
  )
  if (!campground) throw new NotFoundError("Campground")

  res.json("Campground updated successfully")
}

export const deleteCampground = async (req: Request, res: Response) => {
  await Campground.findByIdAndDelete(getParamsId(req))
  
  res.json("Campground deleted successfully")
}
