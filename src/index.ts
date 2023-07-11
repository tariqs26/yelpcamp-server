import express from "express"
import mongoose, { connect, set } from "mongoose"
import MongoDBStore from "connect-mongo"
import cors from "cors"
import helmet from "helmet"
import mongoSanitize from "express-mongo-sanitize"
import session from "express-session"
import passport from "passport"
import { Strategy } from "passport-local"

import { env } from "./lib/env"
import ExpressError from "./lib/express-error"
import campgroundRoutes from "./routers/campgrounds"
import reviewRoutes from "./routers/reviews"
import userRoutes from "./routers/users"
import User from "./models/user"
import handleErrors from "./middlewares/handle-errors"

// Set up mongoose connection
set("strictQuery", true)
connect(env.DATABASE_URL)
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
  console.log("Database connected")
})

const app = express()

// Encode incoming data
app.use(express.json({ limit: "10kb" }))
app.use(express.urlencoded({ extended: true }))

// Setup CORS
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }))
app.use(helmet())
app.use(mongoSanitize())

// Setup session store
const store = new MongoDBStore({
  mongoUrl: env.DATABASE_URL,
  touchAfter: 24 * 60 * 60, // time period in seconds, after which the session will be updated in the database
})

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e)
})

// Setup session
app.set("trust proxy", 1) // trust first proxy
app.use(
  session({
    store,
    secret: env.SECRET,
    resave: false,
    saveUninitialized: true,
    name: "apple touch icon",
    cookie: {
      secure: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // cookie will expire in 7 days
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: "none",
      httpOnly: false,
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

app.all("*", (_, __, next) => {
  next(new ExpressError("Page not found", 404))
})
app.use(handleErrors)

const port = env.PORT || 5000

app
  .listen(port, () => {
    console.log(`🗲 Server is running on port ${port}`)
  })
  .on("error", (e) => {
    console.log("Server error:", e.message)
  })
