import type { Request } from "express"

type User = {
  _id: string
  isAdmin: boolean
}

declare module "express" {
  interface TokenRequest extends Request {
    user?: User | null
  }
}

