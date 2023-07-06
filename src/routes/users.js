import { Router } from "express"
import passport from "passport"
import { accountCreationLimiter } from "../middlewares/rateLimiter.js"
import userLoggedIn from "../middlewares/userLoggedIn.js"
import userAuthorized from "../middlewares/userAuthorized.js"
import * as controller from "../controllers/users.js"
import catchAsync from "../utils/catchAsync.js"

const router = Router()

router.post(
  "/register",
  accountCreationLimiter,
  catchAsync(controller.register)
)

router.post(
  "/login",
  passport.authenticate("local"),
  catchAsync(controller.login)
)

router.get("/logout", controller.logout)

router.get("/getUser", catchAsync(controller.login))

router.delete(
  "/deleteAccount/:id",
  userLoggedIn,
  userAuthorized,
  catchAsync(controller.deleteAccount)
)

export default router
