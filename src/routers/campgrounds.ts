import { Router } from "express"
import { createCampgroundLimiter } from "../middlewares/rate-limiter"
import userAuthenticated from "../middlewares/user-authenticated"
import userAuthorized from "../middlewares/user-authorized"
import validate from "../middlewares/validate"
import { campgroundSchema } from "../lib/validations"
import * as controller from "../controllers/campgrounds"
import { catchAsync } from "../lib/utils"

const router = Router()

router
  .route("/")
  .get(catchAsync(controller.getCampgrounds))
  .post(
    userAuthenticated,
    validate(campgroundSchema),
    createCampgroundLimiter,
    catchAsync(controller.createCampground)
  )

router
  .route("/:id")
  .get(catchAsync(controller.getCampgroundById))
  .put(
    userAuthenticated,
    userAuthorized,
    validate(campgroundSchema),
    catchAsync(controller.updateCampground)
  )
  .delete(
    userAuthenticated,
    userAuthorized,
    catchAsync(controller.deleteCampground)
  )

export default router
