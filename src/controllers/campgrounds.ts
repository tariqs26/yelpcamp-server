import type { Request, Response } from "express"
import dotenv from "dotenv"
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding.js"
import ExpressError from "../lib/ExpressError.js"
import Campground from "../models/campground.js"
import { getParamsId } from "../lib/utils.js"

if (process.env.NODE_ENV !== "production") dotenv.config()

const geocoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN })

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
    .forwardGeocode({
      query: req.body.location,
    })
    .send()
  const campground = new Campground(req.body)
  if (!geoData.body.features[0])
    throw new ExpressError("Location not found", 404)

  campground.geometry = geoData.body.features[0].geometry
  campground.author = req.user?._id
  await campground.save()
  res.send(campground)
}

export async function getCampgroundById(req: Request, res: Response) {
  try {
    const campground = await Campground.findById(getParamsId(req))
    const populateReviews = await campground.populate({
      path: "reviews",
      populate: { path: "author" },
    })
    res.send(await populateReviews.populate("author"))
  } catch (e) {
    throw new ExpressError("Campground not found", 404)
  }
}

export async function updateCampground(req: Request, res: Response) {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.location,
    })
    .send()
  req.body.geometry = geoData.body.features[0].geometry
  await Campground.findByIdAndUpdate(getParamsId(req), req.body, {
    new: true,
  })
  res.json("Campground updated successfully")
}

export async function deleteCampground(req: Request, res: Response) {
  await Campground.findByIdAndDelete(getParamsId(req))
  res.json("Campground deleted successfully")
}
