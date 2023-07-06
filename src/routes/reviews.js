import { Router } from "express"
import validateReview from "../middlewares/validateReview.js"
import userLoggedIn from "../middlewares/userLoggedIn.js"
import ReviewsController from "../controllers/reviews.js"
import catchAsync from "../utils/catchAsync.js"

const [router, controller] = [
  Router({ mergeParams: true }),
  new ReviewsController(),
]

router.post(
  "/",
  userLoggedIn,
  validateReview,
  catchAsync(controller.createReview)
)

router.delete("/:reviewId", userLoggedIn, catchAsync(controller.deleteReview))

export default router
