import { Router } from "express"
import { validate } from "../middlewares/validate"
import { userAuthenticated } from "../middlewares/user-authenticated"
import { reviewSchema } from "../lib/validations"
import { catchAsync } from "../lib/utils"
import * as controller from "../controllers/reviews"

const router = Router({ mergeParams: true })

router.post(
  "/",
  userAuthenticated,
  validate(reviewSchema),
  catchAsync(controller.createReview)
)

router.delete(
  "/:reviewId",
  userAuthenticated,
  catchAsync(controller.deleteReview)
)

export default router
