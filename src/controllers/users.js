import User from '../models/user.js';
import ExpressError from '../utils/ExpressError.js';

export const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    res.send(registeredUser);
  } catch (e) {
    if (e.keyValue)
      throw new ExpressError(
        'A user with the given email is already registered',
        400
      );
    res.status(400).send(e.message);
  }
};

export const login = async (req, res) => {
  res.send(req.user);
};

export const logout = (req, res) => {
  req.logout(() => res.send('Logged out'));
};

export const get = async (req, res) => {
  res.send(req.user);
};
