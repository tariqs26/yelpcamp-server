import type { Request, Response } from "express"
import validate from "../lib/validate"
import { userSchema } from "../lib/validations"
import User from "../models/user"

export async function register(req: Request, res: Response) {
  const { email, username, password } = validate(req.body, userSchema)
  const user = new User({ email, username })
  res.send(await User.register(user, password))
}

export async function login(req: Request, res: Response) {
  res.send(req.user)
}

export function logout(req: Request, res: Response) {
  req.logout(() => res.send("Logged out"))
}

export async function deleteAccount(req: Request, res: Response) {
  await User.findByIdAndDelete(req.user?._id)
  logout(req, res)
}
