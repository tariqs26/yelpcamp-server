import User from "../models/user.js"
import ExpressError from "../utils/ExpressError.js"

export default class UsersController {
  async register(req, res) {
    try {
      const { email, username, password } = req.body
      const user = new User({ email, username })
      const registeredUser = await User.register(user, password)
      res.send(registeredUser)
    } catch (e) {
      if (e.keyValue)
        throw new ExpressError(
          "A user with the given email is already registered",
          400
        )
      res.status(400).send(e.message)
    }
  }

  async login(req, res) {
    res.send(req.user)
  }

  async logout(req, res) {
    req.logout(() => res.send("Logged out"))
  }

  async deleteAccount(req, res) {
    const { id } = req.params
    await User.findByIdAndDelete(id)
    req.logout(() => res.send("Logged out"))
  }
}
