import dotenv from "dotenv"
import Z from "zod"

if (process.env.NODE_ENV !== "production") dotenv.config()

const envSchema = Z.object({
  NODE_ENV: Z.string().optional(),
  PORT: Z.string().optional(),
  DATABASE_URL: Z.string().min(1),
  CLIENT_ORIGIN: Z.string().min(1),
  MAPBOX_TOKEN: Z.string().min(1),
  SECRET: Z.string().min(1)
})

export const env = envSchema.parse(process.env)
