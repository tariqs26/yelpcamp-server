import dotenv from "dotenv"
import { z } from "zod"

if (process.env.NODE_ENV !== "production") dotenv.config()

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().optional(),
  DATABASE_URL: z.string().min(1),
  CLIENT_ORIGIN: z.string().min(1),
  MAPBOX_TOKEN: z.string().min(1),
  SECRET: z.string().min(1),
})

export const env = envSchema.parse(process.env)
