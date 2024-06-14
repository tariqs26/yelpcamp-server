import MongoDBStore from "connect-mongo"
import cors from "cors"
import express from "express"
import mongoSanitize from "express-mongo-sanitize"
import session from "express-session"
import helmet from "helmet"
import mongoose, { connect, set } from "mongoose"
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
connect(env.DATABASE_URL).catch(error => {
  console.error("Database connection error:", error)
})
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
  console.log("Database connected successfully")
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

app.set("trust proxy", 1)
app.use(
  session({
    store,
    secret: env.SECRET,
    resave: false,
    saveUninitialized: true,
    name: "apple touch icon",
    cookie: {
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // cookie will expire in 7 days
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: "none",
      httpOnly: true,
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

const port = env.PORT ?? 5000

const serverUrl = `http://localhost:${port}`

app
  .listen(port, () => {
    console.log(`🗲 Server is running on ${serverUrl}`)
    console.log(`📑 Swagger docs is running on ${serverUrl}/api-docs`)
    if (env.NODE_ENV === "production") task.start()
  })
  .on("error", error => {
    console.error("Server error:", error.message)
  })
