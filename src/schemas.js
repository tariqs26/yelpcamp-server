import Joi from 'joi';

const campgroundSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().required().min(0),
  image: Joi.string().required(),
  description: Joi.string().required(),
  location: Joi.string().required(),
});

const reviewSchema = Joi.object({
  rating: Joi.number().required().min(1).max(5),
  body: Joi.string().required(),
});

const userSchema = Joi.object({
  email: Joi.string().required().email(),
  username: Joi.string().required(),
  password: Joi.string().required().min(8),
});

export { campgroundSchema, reviewSchema, userSchema };
