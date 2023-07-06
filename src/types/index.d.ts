import type { Request } from "express"

type User = {
  _id: string
  isAdmin: boolean
}

declare module "express" {
  interface Request {
    user?: User
  }
}

