import { Request, Response, NextFunction } from "express"

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
