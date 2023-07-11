import type { Request, Response, NextFunction } from "express"
import ExpressError from "./express-error"

export const catchAsync =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }

export const handleErrors = (
  err: { status?: number; message: string },
  _: Request,
  res: Response,
  __: NextFunction
) => {
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong",
  })
}

export const getParamsId = (req: Request) => {
  const { id } = req.params
  if (!id) throw new ExpressError("Missing id", 400)
  if (typeof id !== "string") throw new ExpressError("Invalid id", 400)
  return id
}
