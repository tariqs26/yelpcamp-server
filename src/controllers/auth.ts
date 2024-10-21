import type { Request, Response } from "express"
import { userSchema } from "../lib/schemas"
import { validate } from "../lib/validate"
import User from "../models/user"

export const register = async (req: Request, res: Response) => {
  const { email, username, password } = validate(req.body, userSchema)
  const user = new User({ email, username })
  res.send(await User.register(user, password))
}

export const login = (req: Request, res: Response) => {
  res.send(req.user)
}

export const logout = (req: Request, res: Response) => {
  req.logout(() => res.send("Logged out"))
}

export const deleteAccount = async (req: Request, res: Response) => {
  await User.findByIdAndDelete(req.user?._id)
  logout(req, res)
}
