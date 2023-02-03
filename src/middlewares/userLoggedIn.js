import ExpressError from '../utils/ExpressError.js';

export default function (req, _, next) {
  if (!req.user)
    throw new ExpressError('Please login to access this feature', 401);

  next();
}
