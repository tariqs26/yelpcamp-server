import dotenv from "dotenv"
import Z from "zod"

if (process.env.NODE_ENV !== "production") dotenv.config()

const envSchema = Z.object({
  NODE_ENV: Z.string().optional(),
  PORT: Z.string().optional(),
  DATABASE_URL: Z.string().nonempty(),
  CLIENT_ORIGIN: Z.string().nonempty(),
  MAPBOX_TOKEN: Z.string().nonempty(),
  SECRET: Z.string().nonempty(),
})

export const env = envSchema.parse(process.env)
