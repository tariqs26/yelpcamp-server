import Z from "zod"

const campgroundSchema = Z.object({
  title: Z.string().nonempty(),
  price: Z.number().int().positive(),
  image: Z.string().nonempty(),
  description: Z.string().nonempty(),
  location: Z.string().nonempty(),
})

const reviewSchema = Z.object({
  rating: Z.number().int().min(1).max(5),
  body: Z.string().nonempty(),
})

const userSchema = Z.object({
  email: Z.string().email(),
  username: Z.string().nonempty(),
  password: Z.string().min(8),
})

export { campgroundSchema, reviewSchema, userSchema }
