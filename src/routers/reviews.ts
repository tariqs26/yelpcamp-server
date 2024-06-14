import { Router } from "express"
import * as controller from "../controllers/reviews"
import { catchAsync } from "../lib/utils"
import userAuthenticated from "../middlewares/user-authenticated"

const router = Router({ mergeParams: true })

router.post("/", userAuthenticated, catchAsync(controller.createReview))

router.delete(
  "/:reviewId",
  userAuthenticated,
  catchAsync(controller.deleteReview)
)

export default router
