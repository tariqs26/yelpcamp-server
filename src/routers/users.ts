import { Router } from "express"
import passport from "passport"
import { accountCreationLimiter } from "../middlewares/rateLimiter"
import validate from "../middlewares/validate"
import { userSchema } from "../schemas"
import userLoggedIn from "../middlewares/userLoggedIn"
import userAuthorized from "../middlewares/userAuthorized"
import * as controller from "../controllers/users"
import { catchAsync } from "../lib/utils"

const router = Router()

router.post(
  "/register",
  accountCreationLimiter,
  validate(userSchema),
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
