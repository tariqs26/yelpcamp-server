import type { User } from "express"

declare module "express" {
  export interface Request {
    user?: User & {
      _id: string
      isAdmin: boolean
    }
  }
}
