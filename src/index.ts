import MongoStore from "connect-mongo"
import cors from "cors"
import express from "express"
import session from "express-session"
import helmet from "helmet"
import { connect, set } from "mongoose"
import morgan from "morgan"
import passport from "passport"
import { Strategy } from "passport-local"

import authRoutes from "./routers/auth"
import campgroundRoutes from "./routers/campgrounds"
import reviewRoutes from "./routers/reviews"

import { env } from "./lib/env"
import { NotFoundError } from "./lib/exceptions"
import swaggerDocs from "./lib/swagger"
import { errorHandler } from "./middlewares/error-handler"
import User from "./models/user"

set("strictQuery", true)
if (env.NODE_ENV === "development") set("debug", true)
connect(env.DATABASE_URL)
  .then(() => {
    console.log("Database connecting successfully")
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message)
  })

const app = express()

if (env.NODE_ENV === "production") app.set("trust proxy", 1)

app.use(helmet())
app.use(express.json({ limit: "10kb" }))
app.use(express.urlencoded())
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }))
app.use(morgan("dev"))

app.use(
  session({
    secret: env.SECRET,
    resave: false,
    saveUninitialized: false,
    name: "session",
    cookie: {
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    },
    store: MongoStore.create({ mongoUrl: env.DATABASE_URL }),
  })
)

app.use(passport.initialize(), passport.session())
passport.use(new Strategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.get("/healthz", (_req, res) => {
  const uptime = process.hrtime()
  res.send({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: `${uptime[0]}s ${uptime[1] / 1e6}ms`,
  })
})
app.use("/", authRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/reviews", reviewRoutes)
swaggerDocs(app)
app.all("*all", () => {
  throw new NotFoundError("Route")
})
app.use(errorHandler)

const port = env.PORT
const serverUrl = `http://localhost:${port}`

app
  .listen(port, () => {
    console.info(env)
    console.info(`🗲 Server is running on ${serverUrl}`)
    console.info(`📑 Swagger docs is running on ${serverUrl}/api-docs`)
  })
  .on("error", (error) => {
    console.error("Server error:", error.message)
  })
