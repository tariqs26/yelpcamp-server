import { Router } from "express"
import validate from "../middlewares/validate"
import { reviewSchema } from "../schemas"
import userLoggedIn from "../middlewares/userLoggedIn"
import * as controller from "../controllers/reviews"
import { catchAsync } from "../lib/utils"

const router = Router({ mergeParams: true })

router.post(
  "/",
  userLoggedIn,
  validate(reviewSchema),
  catchAsync(controller.createReview)
)

router.delete("/:reviewId", userLoggedIn, catchAsync(controller.deleteReview))

export default router
