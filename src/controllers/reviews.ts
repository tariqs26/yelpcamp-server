import type { Request, Response } from "express"
import { NotAuthorizedError, NotFoundError } from "../lib/exceptions"
import { reviewSchema } from "../lib/schemas"
import { getParamsId } from "../lib/utils"
import { validate } from "../lib/validate"
import Campground from "../models/campground"
import Review from "../models/review"

export const createReview = async (req: Request, res: Response) => {
  const campground = await Campground.findById(getParamsId(req))
  if (!campground) throw new NotFoundError("Campground")

  const review = new Review(validate(req.body, reviewSchema))
  review.author = req.user?._id

  campground.reviews.push(review)
  await Promise.all([review.save(), campground.save()])

  res.send(await review.populate("author"))
}

export const deleteReview = async (req: Request, res: Response) => {
  const { id, reviewId } = req.params
  const review = await Review.findById(reviewId)

  if (!review) throw new NotFoundError("Review")
  if (!review.author.equals(req.user?._id)) throw new NotAuthorizedError()

  await Promise.all([
    Campground.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    }),
    Review.findByIdAndDelete(reviewId),
  ])

  res.json("Review deleted successfully")
}
