import type { Request, Response } from "express"
import User from "../models/user"
import ExpressError from "../lib/ExpressError"
import { MongooseError } from "mongoose"
import { getParamsId } from "../lib/utils"

export async function register(req: Request, res: Response) {
  try {
    const { email, username, password } = req.body
    const user = new User({ email, username })
    res.send(await User.register(user, password))
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
  await User.findByIdAndDelete(getParamsId(req))
  req.logout(() => res.send("Logged out"))
}
