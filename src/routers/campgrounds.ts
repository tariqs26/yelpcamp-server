import { Router } from "express"
import { createCampgroundLimiter } from "../middlewares/rateLimiter"
import userLoggedIn from "../middlewares/userLoggedIn"
import userAuthorized from "../middlewares/userAuthorized"
import validate from "../middlewares/validate"
import { campgroundSchema } from "../schemas"
import * as controller from "../controllers/campgrounds"
import { catchAsync } from "../lib/utils"

const router = Router()

router
  .route("/")
  .get(catchAsync(controller.getCampgrounds))
  .post(
    userLoggedIn,
    validate(campgroundSchema),
    createCampgroundLimiter,
    catchAsync(controller.createCampground)
  )

router
  .route("/:id")
  .get(catchAsync(controller.getCampgroundById))
  .put(
    userLoggedIn,
    userAuthorized,
    validate(campgroundSchema),
    catchAsync(controller.updateCampground)
  )
  .delete(userLoggedIn, userAuthorized, catchAsync(controller.deleteCampground))

export default router
