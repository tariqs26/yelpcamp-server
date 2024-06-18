import type { SafeParseReturnType } from "zod"
import { BadRequestError } from "./exceptions"

const validate = <Input, Output>(
  value: unknown,
  schema: {
    safeParse(data: unknown): SafeParseReturnType<Input, Output>
  }
): Output => {
  const data = schema.safeParse(value)

  if (!data.success) {
    console.error(data.error)
    throw new BadRequestError("Invalid data")
  }

  return data.data
}

export default validate
