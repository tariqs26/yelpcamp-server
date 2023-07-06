import { Request, Response, NextFunction } from "express"

export const catchAsync =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }
