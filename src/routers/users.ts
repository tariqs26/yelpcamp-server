import { Router } from "express"
import passport from "passport"
import * as controller from "../controllers/users"
import { catchAsync } from "../lib/utils"
import { registerAccountLimiter } from "../middlewares/rate-limiter"
import userAuthenticated from "../middlewares/user-authenticated"

const router = Router()

router.post(
  "/register",
  registerAccountLimiter,
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
