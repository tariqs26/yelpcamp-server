import dotenv from "dotenv"
import { z } from "zod"

if (process.env.NODE_ENV !== "production") dotenv.config()

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("3000"),
  DATABASE_URL: z.string().url(),
  CLIENT_ORIGIN: z.string().url(),
  MAPBOX_TOKEN: z.string().min(1),
  SECRET: z.string().min(1),
})

export const env = envSchema.parse(process.env)
