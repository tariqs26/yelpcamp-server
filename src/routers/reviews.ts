import { Router } from "express"
import validate from "../middlewares/validate"
import { reviewSchema } from "../lib/validations"
import userAuthenticated from "../middlewares/user-authenticated"
import * as controller from "../controllers/reviews"
import { catchAsync } from "../lib/utils"

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
