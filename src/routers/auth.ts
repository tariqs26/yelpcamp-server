import { Router } from "express"
import passport from "passport"
import * as controller from "../controllers/auth"
import { catchAsync } from "../lib/utils"
import { registerAccountLimiter } from "../middlewares/rate-limiter"
import { userAuthenticated } from "../middlewares/user-authenticated"

const router = Router()

router
  .post("/register", registerAccountLimiter, catchAsync(controller.register))
  .post("/login", passport.authenticate("local"), controller.getUser)
  .post("/logout", userAuthenticated, controller.logout)
  .get("/getUser", controller.getUser)
  .delete(
    "/deleteAccount",
    userAuthenticated,
    catchAsync(controller.deleteAccount)
  )

export default router
