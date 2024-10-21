import { Router } from "express"
import * as controller from "../controllers/reviews"
import { catchAsync } from "../lib/utils"
import { userAuthenticated } from "../middlewares/user-authenticated"

const router = Router({ mergeParams: true })

router
  .use(userAuthenticated)
  .post("/", catchAsync(controller.createReview))
  .delete("/:reviewId", catchAsync(controller.deleteReview))

export default router
