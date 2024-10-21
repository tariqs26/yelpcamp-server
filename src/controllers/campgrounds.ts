import type { Request, Response } from "express"
import { NotFoundError } from "../lib/exceptions"
import { getGeoDataGeometry } from "../lib/geocoder"
import { campgroundSchema } from "../lib/schemas"
import { getParamsId } from "../lib/utils"
import { validate } from "../lib/validate"
import Campground from "../models/campground"

export async function getCampgrounds(req: Request, res: Response) {
  const { page = 1 } = req.query
  const MAX_CAMPGROUNDS = 5

  res.send({
    campgrounds: await Campground.find({})
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * MAX_CAMPGROUNDS)
      .limit(MAX_CAMPGROUNDS),
    totalPages: Math.ceil(
      (await Campground.countDocuments()) / MAX_CAMPGROUNDS
    ),
  })
}

export async function createCampground(req: Request, res: Response) {
  const body = validate(req.body, campgroundSchema)

  const geometry = await getGeoDataGeometry(body.location)

  const campground = new Campground(body)

  campground.geometry = geometry
  campground.author = req.user?._id

  await campground.save()

  res.send(campground)
}

export async function getCampgroundById(req: Request, res: Response) {
  const campground = await Campground.findById(getParamsId(req))

  if (!campground) throw new NotFoundError("Campground")

  const populateReviews = await campground.populate({
    path: "reviews",
    populate: { path: "author", select: "_id username isAdmin" },
  })

  res.send(await populateReviews.populate("author", "_id username isAdmin"))
}

export async function updateCampground(req: Request, res: Response) {
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

export async function deleteCampground(req: Request, res: Response) {
  await Campground.findByIdAndDelete(getParamsId(req))
  res.json("Campground deleted successfully")
}
