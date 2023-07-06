import { Router } from "express"
import { createCampgroundLimiter } from "../middlewares/rateLimiter.js"
import userLoggedIn from "../middlewares/userLoggedIn.js"
import userAuthorized from "../middlewares/userAuthorized.js"
import validateCampground from "../middlewares/validateCampground.js"
import CampgroundsController from "../controllers/campgrounds.js"
import catchAsync from "../utils/catchAsync.js"

const [router, controller] = [Router(), new CampgroundsController()]

router
  .route("/")
  .get(catchAsync(controller.getCampgrounds))
  .post(
    userLoggedIn,
    validateCampground,
    createCampgroundLimiter,
    catchAsync(controller.createCampground)
  )

router
  .route("/:id")
  .get(catchAsync(controller.getCampgroundById))
  .put(
    userLoggedIn,
    userAuthorized,
    validateCampground,
    catchAsync(controller.updateCampground)
  )
  .delete(userLoggedIn, userAuthorized, catchAsync(controller.deleteCampground))

export default router
