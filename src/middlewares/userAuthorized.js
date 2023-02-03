import ExpressError from '../utils/ExpressError.js';
import Campground from '../models/campground.js';

export default async function (req, _, next) {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id))
    throw new ExpressError('You do not have permission to do that', 403);

  next();
}
