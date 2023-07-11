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
import { handleErrors } from "./lib/utils"
import campgroundRoutes from "./routers/campgrounds"
import reviewRoutes from "./routers/reviews"
import userRoutes from "./routers/users"
import User from "./models/user"

export default class Server {
  private app: express.Application

  constructor() {
    this.app = express()
    this.config()
    this.routes()
    this.connectDB()
    this.setupSession()
    this.setupPassport()
  }

  private config(): void {
    this.app.use(express.json({ limit: "10kb" }))
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }))
    this.app.use(helmet())
    this.app.use(mongoSanitize())
  }

  private routes(): void {
    this.app.use("/api/campgrounds", campgroundRoutes)
    this.app.use("/api/campgrounds/:id/reviews", reviewRoutes)
    this.app.use("/api/users", userRoutes)
    this.app.all("*", (_, __, next) => {
      next(new ExpressError("Page not found", 404))
    })
    this.app.use(handleErrors)
  }

  private connectDB(): void {
    set("strictQuery", true)
    connect(env.DATABASE_URL)
    const db = mongoose.connection
    db.on("error", console.error.bind(console, "connection error:"))
    db.once("open", () => {
      console.log("Database connected")
    })
  }

  private setupSession(): void {
    const store = new MongoDBStore({
      mongoUrl: env.DATABASE_URL,
      touchAfter: 24 * 60 * 60, // time period in seconds, after which the session will be updated in the database
    }).on("error", function (e) {
      console.log("SESSION STORE ERROR", e)
    })

    // Setup session
    this.app.set("trust proxy", 1) // trust first proxy
    this.app.use(
      session({
        store,
        secret: env.SECRET,
        resave: false,
        saveUninitialized: true,
        name: "apple touch icon",
        cookie: {
          secure: true,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // expires in 7 days
          maxAge: 1000 * 60 * 60 * 24 * 7,
          sameSite: "none",
          httpOnly: false,
        },
      })
    )
  }

  private setupPassport(): void {
    this.app.use(passport.initialize())
    passport.use(new Strategy(User.authenticate()))
    passport.serializeUser(User.serializeUser())
    passport.deserializeUser(User.deserializeUser())
  }

  public start(port: number | string) {
    return new Promise((resolve, reject) => {
      this.app
        .listen(port, () => resolve(port))
        .on("error", (e: Error) => reject(e))
    })
  }
}
