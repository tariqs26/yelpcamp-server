import express from "express"
import dotenv from "dotenv"
import mongoose, { connect, set } from "mongoose"
import MongoDBStore from "connect-mongo"
import cors from "cors"
import helmet from "helmet"
import mongoSanitize from "express-mongo-sanitize"
import session from "express-session"
import passport from "passport"
import { Strategy } from "passport-local"

import ExpressError from "./lib/ExpressError"
import { handleErrors } from "./lib/utils"
import campgroundRoutes from "./routes/campgrounds"
import reviewRoutes from "./routes/reviews"
import userRoutes from "./routes/users"
import User from "./models/user"

if (process.env.NODE_ENV !== "production") dotenv.config()

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp"

// Set up mongoose connection
set("strictQuery", true)
connect(dbUrl)
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
  console.log("Database connected")
})

const app = express()

// encoding incoming data
app.use(express.json({ limit: "10kb" }))
app.use(express.urlencoded({ extended: true }))

// Set up CORS
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
)
app.use(helmet()) // set security HTTP headers
app.use(mongoSanitize()) // prevent NoSQL injection

const secret = process.env.SECRET || "thisshouldbeabettersecret!"

// Set up session store
const store = new MongoDBStore({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60, // time period in seconds, after which the session will be updated in the database
})

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e)
})
app.set("trust proxy", 1) // trust first proxy
// Set up session
app.use(
  session({
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    name: "apple touch icon",
    cookie: {
      secure: true, // only set cookies over https (comment out when testing)
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // cookie will expire in 7 days
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: "none", // (comment out when testing)
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

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`🗲 Server is running on port ${port}`)
})
