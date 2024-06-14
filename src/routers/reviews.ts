import { Router } from "express"
import * as controller from "../controllers/reviews"
import { catchAsync } from "../lib/utils"
import { reviewSchema } from "../lib/validations"
import { userAuthenticated } from "../middlewares/user-authenticated"
import { validate } from "../middlewares/validate"

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
