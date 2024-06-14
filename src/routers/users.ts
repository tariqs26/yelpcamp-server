import { Router } from "express"
import passport from "passport"
import * as controller from "../controllers/users"
import { catchAsync } from "../lib/utils"
import { userSchema } from "../lib/validations"
import { registerAccountLimiter } from "../middlewares/rate-limiter"
import { userAuthenticated } from "../middlewares/user-authenticated"
import { validate } from "../middlewares/validate"

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
  userAuthenticated,
  catchAsync(controller.deleteAccount)
)

export default router
