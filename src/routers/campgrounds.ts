import { Router } from "express"
import * as controller from "../controllers/campgrounds"
import { catchAsync } from "../lib/utils"
import { createCampgroundLimiter } from "../middlewares/rate-limiter"
import userAuthenticated from "../middlewares/user-authenticated"
import userAuthorized from "../middlewares/user-authorized"

const router = Router()

router
  .route("/")
  .get(catchAsync(controller.getCampgrounds))
  .post(
    userAuthenticated,
    createCampgroundLimiter,
    catchAsync(controller.createCampground)
  )

router
  .route("/:id")
  .get(catchAsync(controller.getCampgroundById))
  .put(
    userAuthenticated,
    userAuthorized,
    catchAsync(controller.updateCampground)
  )
  .delete(
    userAuthenticated,
    userAuthorized,
    catchAsync(controller.deleteCampground)
  )

export default router
