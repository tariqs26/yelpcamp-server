import { Request, Response, NextFunction } from "express"
import { AnyZodObject, ZodError } from "zod"

/**
 * Validate request body or query
 * @param schema - Zod schema
 * @param isQuery - Validate query instead of body
 */
export default function validate(schema: AnyZodObject, isQuery = false) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (isQuery) await schema.parseAsync(req.query)
      else await schema.parseAsync(req.body)
      return next()
    } catch (error) {
      if (error instanceof ZodError)
        res.status(400).json({
          error: error.issues.map((error) => ({
            field: error.path[0],
            message: error.message,
          })),
        })
    }
  }
}
