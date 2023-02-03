import Review from '../models/review.js';
import Campground from '../models/campground.js';
import ExpressError from '../utils/ExpressError.js';

export const createReview = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  const review = new Review(req.body);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  res.send(await review.populate('author'));
};

export const deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    throw new ExpressError(
      'You do not have permission to delete this review',
      401
    );
  }
  await Campground.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  await Review.findByIdAndDelete(reviewId);
  res.send('Review deleted');
};
