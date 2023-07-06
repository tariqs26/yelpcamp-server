import type { TokenRequest, Response } from "express"
import Campground from "../models/campground.js"
import Review from "../models/review.js"
import ExpressError from "../lib/ExpressError.js"

export async function createReview(req: TokenRequest, res: Response) {
  const { id } = req.params
  const campground = await Campground.findById(id)
  const review = new Review(req.body)
  review.author = req.user?._id
  campground.reviews.push(review)
  await review.save()
  await campground.save()
  res.send(await review.populate("author"))
}

export async function deleteReview(req: TokenRequest, res: Response) {
  const { id, reviewId } = req.params
  const review = await Review.findById(reviewId)
  if (!review.author.equals(req.user?._id)) {
    throw new ExpressError(
      "You do not have permission to delete this review",
      401
    )
  }
  await Campground.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  })
  await Review.findByIdAndDelete(reviewId)
  res.send("Review deleted")
}
