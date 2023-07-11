import type { Request, Response, NextFunction } from "express"
import ExpressError from "./express-error"

export const catchAsync =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }

export const getParamsId = (req: Request) => {
  const { id } = req.params
  if (!id) throw new ExpressError("Missing id", 400)
  if (typeof id !== "string") throw new ExpressError("Invalid id", 400)
  return id
}
