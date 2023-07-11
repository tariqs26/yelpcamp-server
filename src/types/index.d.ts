import "express"

declare module "express" {
  interface Request {
    user?: {
      _id: string
      isAdmin: boolean
    }
  }
}
