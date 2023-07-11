import type { Request, Response, NextFunction } from "express"

export default function handleErrors(
  err: { status?: number; message: string },
  _: Request,
  res: Response,
  __: NextFunction
) {
  return res
    .status(err.status || 500)
    .send(err.message || "Something went wrong")
}
