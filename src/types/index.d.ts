import type { Request } from "express"

type User = {
  _id: string
}

declare module "express" {
  interface TokenRequest extends Request {
    user?: User | null
  }
}

