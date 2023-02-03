import { Router } from 'express';
import validateReview from '../middlewares/validateReview.js';
import userLoggedIn from '../middlewares/userLoggedIn.js';
import { createReview, deleteReview } from '../controllers/reviews.js';
import catchAsync from '../utils/catchAsync.js';

const router = Router({
  mergeParams: true,
});

router.post('/', userLoggedIn, validateReview, catchAsync(createReview));

router.delete('/:reviewId', userLoggedIn, catchAsync(deleteReview));

export default router;
