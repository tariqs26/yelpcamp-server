import MongoDBStore from "connect-mongo"
import cors from "cors"
import express from "express"
import mongoSanitize from "express-mongo-sanitize"
import session from "express-session"
import helmet from "helmet"
import { connect, set } from "mongoose"
import morgan from "morgan"
import passport from "passport"
import { Strategy } from "passport-local"

import { env } from "./lib/env"
import { NotFoundError } from "./lib/exceptions"
import swaggerDocs from "./lib/swagger"
import { errorHandler } from "./middlewares/error-handler"
import User from "./models/user"
import campgroundRoutes from "./routers/campgrounds"
import reviewRoutes from "./routers/reviews"
import authRoutes from "./routers/auth"

set("strictQuery", true)
if (env.NODE_ENV === "development") set("debug", true)
connect(env.DATABASE_URL)
  .then(() => {
    console.log("Database connecting successfully")
  })
  .catch((error) => {
    console.error("Database connection error:", error)
  })

const app = express()

if (env.NODE_ENV === "production") app.set("trust proxy", 1)

app.use(express.json({ limit: "10kb" }))
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }))
app.use(morgan("dev"))
app.use(helmet())
app.use(mongoSanitize())

const store = new MongoDBStore({
  mongoUrl: env.DATABASE_URL,
  touchAfter: 24 * 60 * 60,
}).on("error", (error) => {
  console.error("Session store error", error)
})

app.use(
  session({
    store,
    secret: env.SECRET,
    resave: false,
    saveUninitialized: false,
    name: "session",
    cookie: {
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    },
  })
)

app.use(passport.initialize(), passport.session())
passport.use(new Strategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.get("/healthz", (_req, res) => {
  const uptime = process.hrtime()
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: `${uptime[0]}s ${uptime[1] / 1e6}ms`,
  })
})
app.use("/", authRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/reviews", reviewRoutes)
swaggerDocs(app)
app.all("*", (_req, _res, next) => {
  next(new NotFoundError("Page"))
})
app.use(errorHandler)

const port = env.PORT ?? 3000
const serverUrl = `http://localhost:${port}`

app
  .listen(port, () => {
    console.log(env)
    console.log(`🗲 Server is running on ${serverUrl}`)
    console.log(`📑 Swagger docs is running on ${serverUrl}/api-docs`)
  })
  .on("error", (error) => {
    console.error("Server error:", error.message)
  })
