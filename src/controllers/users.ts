import type { Request, Response } from "express"
import User from "../models/user.js"
import ExpressError from "../lib/ExpressError.js"
import { MongooseError } from "mongoose"

export async function register(req: Request, res: Response) {
  try {
    const { email, username, password } = req.body
    const user = new User({ email, username })
    const registeredUser = await User.register(user, password)
    res.send(registeredUser)
  } catch (e) {
    if (e instanceof MongooseError) throw new ExpressError(e.message, 400)
  }
}

export async function login(req: Request, res: Response) {
  res.send(req.user)
}

export async function logout(req: Request, res: Response) {
  req.logout(() => res.send("Logged out"))
}

export async function deleteAccount(req: Request, res: Response) {
  const { id } = req.params
  await User.findByIdAndDelete(id)
  req.logout(() => res.send("Logged out"))
}
