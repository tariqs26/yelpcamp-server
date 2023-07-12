import type { Request, Response } from "express"
import Campground from "../models/campground"
import Review from "../models/review"
import ExpressError from "../lib/express-error"
import { getParamsId } from "../lib/utils"

export async function createReview(req: Request, res: Response) {
  const campground = await Campground.findById(getParamsId(req))
  if (!campground) throw new ExpressError("Campground not found", 404)
  const review = new Review(req.body)
  review.author = req.user?._id
  campground.reviews.push(review)
  await Promise.all([review.save(), campground.save()])
  res.send(await review.populate("author"))
}

export async function deleteReview(req: Request, res: Response) {
  const { id, reviewId } = req.params
  const review = await Review.findById(reviewId)
  if (!review) throw new ExpressError("Review not found", 404)
  if (!review.author.equals(req.user?._id)) {
    throw new ExpressError(
      "You do not have permission to delete this review",
      401
    )
  }
  await Promise.all([
    Campground.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    }),
    Review.findByIdAndDelete(reviewId),
  ])
  res.send("Review deleted")
}
