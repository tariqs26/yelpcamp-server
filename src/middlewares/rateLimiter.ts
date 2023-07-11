import { rateLimit } from "express-rate-limit"

export const registerAccountLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 1 day window
  max: 5,
  skipFailedRequests: true,
  message: "Too many accounts created, please try again after a day",
})

export const createCampgroundLimiter = rateLimit({
  windowMs: 1 * 60 * 60 * 1000, // 1 hour window
  max: 5,
  skipFailedRequests: true,
  message: "Too many campgrounds created, please try again after an hour",
})
