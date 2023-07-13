import type { Request, Response, NextFunction } from "express"
import { BadRequestError } from "./exceptions"

export const catchAsync =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }

export const getParamsId = (req: Request) => {
  const { id } = req.params
  if (!id) throw new BadRequestError("Missing id")
  if (typeof id !== "string") throw new BadRequestError("Invalid id")
  return id
}
