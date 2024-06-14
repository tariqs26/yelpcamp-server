import { z } from "zod"

export const campgroundSchema = z.object({
  title: z.string().min(1),
  price: z.number().int().positive(),
  image: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
})

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  body: z.string().min(1),
})

export const userSchema = z.object({
  email: z.string().email(),
  username: z.string().min(1),
  password: z.string().min(8),
})
