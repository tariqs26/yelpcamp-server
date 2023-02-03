import { Schema, model } from 'mongoose';
import Review from './review.js';

const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  createdAt: {
    type: Date,
    default: Date.now,
    mutable: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    mutable: false,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
  if (doc)
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
});

CampgroundSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

export default model('Campground', CampgroundSchema);
