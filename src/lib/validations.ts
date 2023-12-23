import Z from "zod"

export const campgroundSchema = Z.object({
  title: Z.string().min(1),
  price: Z.number().int().positive(),
  image: Z.string().min(1),
  description: Z.string().min(1),
  location: Z.string().min(1),
})

export const reviewSchema = Z.object({
  rating: Z.number().int().min(1).max(5),
  body: Z.string().min(1),
})

export const userSchema = Z.object({
  email: Z.string().email(),
  username: Z.string().min(1),
  password: Z.string().min(8),
})
