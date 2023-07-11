import { Router } from "express"
import passport from "passport"
import { registerAccountLimiter } from "../middlewares/rate-limiter"
import validate from "../middlewares/validate"
import { userSchema } from "../schemas"
import userLoggedIn from "../middlewares/user-authenticated"
import userAuthorized from "../middlewares/user-authorized"
import * as controller from "../controllers/users"
import { catchAsync } from "../lib/utils"

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
  "/deleteAccount/:id",
  userLoggedIn,
  userAuthorized,
  catchAsync(controller.deleteAccount)
)

export default router
