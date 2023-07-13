import type { Request, Response } from "express"
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding"
import { env } from "../lib/env"
import { NotFoundError } from "../lib/exceptions"
import Campground from "../models/campground"
import { getParamsId } from "../lib/utils"

const geocoder = mbxGeocoding({ accessToken: env.MAPBOX_TOKEN })

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
  const geoData = await geocoder
    .forwardGeocode({ query: req.body.location })
    .send()

  if (!geoData.body.features[0]) throw new NotFoundError("Location")

  const campground = new Campground(req.body)
  campground.geometry = geoData.body.features[0].geometry
  campground.author = req.user?._id
  await campground.save()
  res.send(campground)
}

export async function getCampgroundById(req: Request, res: Response) {
  const campground = await Campground.findById(getParamsId(req))
  if (!campground) throw new NotFoundError("Campground")
  const populateReviews = await campground.populate({
    path: "reviews",
    populate: { path: "author" },
  })
  res.send(await populateReviews.populate("author"))
}

export async function updateCampground(req: Request, res: Response) {
  const { body } = await geocoder
    .forwardGeocode({ query: req.body.location })
    .send()

  const campground = await Campground.findByIdAndUpdate(
    getParamsId(req),
    {
      ...req.body,
      geometry: body.features[0]?.geometry,
    },
    { new: true }
  )
  if (!campground) throw new NotFoundError("Campground")
  res.json("Campground updated successfully")
}

export async function deleteCampground(req: Request, res: Response) {
  const campground = await Campground.findByIdAndDelete(getParamsId(req))
  if (!campground) throw new NotFoundError("Campground")
  res.json("Campground deleted successfully")
}
