import type { NextFunction, Request, Response } from "express"
import { BadRequestError } from "./exceptions"

export const catchAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
    (req: Request, res: Response, next: NextFunction) => {
      fn(req, res, next).catch(next)
    }

export const getParamsId = (req: Request) => {
  const { id } = req.params
  if (id === undefined) throw new BadRequestError("Missing id")
  if (typeof id !== "string") throw new BadRequestError("Invalid id")
  return id
}
