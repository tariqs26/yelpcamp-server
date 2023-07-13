import { Router } from "express"
import passport from "passport"
import { registerAccountLimiter } from "../middlewares/rate-limiter"
import userLoggedIn from "../middlewares/user-authenticated"
import validate from "../middlewares/validate"
import { userSchema } from "../lib/validations"
import { catchAsync } from "../lib/utils"
import * as controller from "../controllers/users"

const router = Router()

router.post(
  "/register",
  registerAccountLimiter,
  validate(userSchema),
  catchAsync(controller.register)
)

router.post(
  "/login",
  passport.authenticate("local"),
  catchAsync(controller.login)
)

router.post("/logout", controller.logout)

router.get("/getUser", catchAsync(controller.login))

router.delete(
  "/deleteAccount",
  userLoggedIn,
  catchAsync(controller.deleteAccount)
)

export default router
