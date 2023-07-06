import { reviewSchema } from "../schemas.js"
import ExpressError from "../lib/ExpressError.js"

const validateReview = (req, _, next) => {
  const { error } = reviewSchema.validate(req.body)
  if (error) {
    const msg = error.details.map((el) => el.message).join(",")
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

export default validateReview
