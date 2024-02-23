import type { Request, Response, NextFunction } from "express"
import { type AnyZodObject, ZodError } from "zod"

/**
 * Validate request body or query
 * @param schema - Zod schema
 * @param isQuery - Validate query instead of body
 */
export function validate(schema: AnyZodObject, isQuery = false) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (isQuery) schema.parse(req.query)
      else schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: error.issues.map(({ path, message }) => ({
            field: path[0],
            message,
          })),
        })
      }
    }
  }
}
