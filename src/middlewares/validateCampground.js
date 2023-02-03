import { campgroundSchema } from '../schemas.js';

const validateCampground = (req, _, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  }
  next();
};

export default validateCampground;
