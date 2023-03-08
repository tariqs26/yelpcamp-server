import { rateLimit } from 'express-rate-limit';

export const accountCreationLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 1 day window
  max: 5, // start blocking after 5 requests
  message:
    'Too many accounts created from this IP, please try again after a day',
});

export const createCampgroundLimiter = rateLimit({
  windowMs: 5 * 60 * 60 * 1000, // 1 hour window
  max: 5, // start blocking after 5 requests
  message:
    'Too many campgrounds created from this IP, please try again after an hour',
});
