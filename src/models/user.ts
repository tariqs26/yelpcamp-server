import { Schema, model } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import Campground from './campground';
import Review from './review';

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
    immutable: true,
  },
});

UserSchema.plugin(passportLocalMongoose);

UserSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({ author: doc._id });
    await Campground.deleteMany({ author: doc._id });
  }
});

export default model('User', UserSchema);
