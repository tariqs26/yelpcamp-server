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

import { task } from "./lib/cron"
import { env } from "./lib/env"
import { NotFoundError } from "./lib/exceptions"
import swaggerDocs from "./lib/swagger"
import errorHandler from "./middlewares/error-handler"
import User from "./models/user"
import campgroundRoutes from "./routers/campgrounds"
import reviewRoutes from "./routers/reviews"
import userRoutes from "./routers/users"

set("strictQuery", true)
if (env.NODE_ENV === "development") set("debug", true)
connect(env.DATABASE_URL)
  .then(() => {
    console.log("Database connecting successfully")
  })
  .catch(error => {
    console.error("Database connection error:", error)
  })

const app = express()

app.use(express.json({ limit: "10kb" }))
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }))
app.use(morgan("dev"))
app.use(helmet())
app.use(mongoSanitize())

const store = new MongoDBStore({
  mongoUrl: env.DATABASE_URL,
  touchAfter: 24 * 60 * 60,
}).on("error", error => {
  console.error("Session store error", error)
})

if (env.NODE_ENV === "production") app.set("trust proxy", 1)

app.use(
  session({
    store,
    secret: env.SECRET,
    resave: false,
    saveUninitialized: true,
    name: "session",
    cookie: {
      secure: env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    },
  })
)

app.use(passport.initialize(), passport.session())
passport.use(new Strategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/reviews", reviewRoutes)
app.use("/", userRoutes)
app.use("/ping", (_, res) =>
  res.send(
    `pong ${new Date().toLocaleString("en-CA", {
      dateStyle: "full",
      timeStyle: "medium",
      timeZone: "America/Toronto",
    })}`
  )
)
swaggerDocs(app)
app.all("*", (_, __, next) => {
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
    if (env.NODE_ENV === "production") task.start()
  })
  .on("error", error => {
    console.error("Server error:", error.message)
  })
