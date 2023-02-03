import Campground from '../models/campground.js';
import ExpressError from '../utils/ExpressError.js';

export const index = async (_, res) => {
  // const { page = 1 } = req.query;
  // const MAX_CAMPGROUNDS = 10;

  res.send(await Campground.find({})
  );
};

export const getCampground = async (req, res) => {
  const { id } = req.params;
  try {
    const campground = await Campground.findById(id);
    const populateReviews = await campground.populate({
      path: 'reviews',
      populate: { path: 'author' },
    });
    const populateAuthor = await populateReviews.populate('author');
    res.send(populateAuthor);
  } catch (e) {
    throw new ExpressError('Campground not found', 404);
  }
};

export const createCampground = async (req, res) => {
  const campground = new Campground(req.body);
  campground.author = req.user._id;
  await campground.save();
  res.send(campground);
};

export const updateCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  res.send('Campground updated');
};

export const deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.send('Campground deleted');
};
