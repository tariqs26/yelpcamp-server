import type { Request, User as ExpressUser } from "express"

type User = {
  _id: string
  isAdmin: boolean
}

declare module "express" {
  interface Request {
    user?: ExpressUser & User
  }
}
