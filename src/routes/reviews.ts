import { Router } from "express"
import validateReview from "../middlewares/validateReview.js"
import userLoggedIn from "../middlewares/userLoggedIn.js"
import * as controller from "../controllers/reviews.js"
import { catchAsync } from "../lib/utils.js"

const router = Router({ mergeParams: true })

router.post(
  "/",
  userLoggedIn,
  validateReview,
  catchAsync(controller.createReview)
)

router.delete("/:reviewId", userLoggedIn, catchAsync(controller.deleteReview))

export default router
