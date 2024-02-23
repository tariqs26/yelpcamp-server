import type { Request, Response } from "express"
import User from "../models/user"

export async function register(req: Request, res: Response) {
  const { email, username, password } = req.body as {
    email: string
    username: string
    password: string
  }
  const user = new User({ email, username })
  res.send(await User.register(user, password))
}

export async function login(req: Request, res: Response) {
  res.send(req.user)
}

export async function logout(req: Request, res: Response) {
  req.logout(() => res.send("Logged out"))
}

export async function deleteAccount(req: Request, res: Response) {
  await User.findByIdAndDelete(req.user?._id)
  await logout(req, res)
}
